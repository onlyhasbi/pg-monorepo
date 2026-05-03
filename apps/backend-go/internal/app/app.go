package app

import (
	"database/sql"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/gzip"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/auth"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/settings"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/admin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/overview"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/public"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/services"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/middleware"
)

func SetupRouter(db *sql.DB, cld *cloudinary.Cloudinary) *gin.Engine {
	r := gin.Default()

	// Global Middleware
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.RateLimit(100, time.Minute))

	// Services
	goldPriceService := services.NewGoldPriceService()
	jwtSecret := os.Getenv("JWT_SECRET")

	api := r.Group("/api")
	{
		// Public Module
		publicHandler := public.NewPublicHandler(db, goldPriceService)
		publicGroup := api.Group("/public")
		{
			publicGroup.GET("/pgbo/:pageid", publicHandler.GetAgentProfile)
			publicGroup.GET("/vcard/:pageid", publicHandler.GetAgentVCard)
			publicGroup.GET("/agents", publicHandler.GetAgentsList)
			publicGroup.GET("/random", publicHandler.GetRandomAgent)
			publicGroup.GET("/gold-prices", publicHandler.GetGoldPrices)
			publicGroup.POST("/analytics", publicHandler.TrackAnalytics)
			publicGroup.POST("/portal/verify", publicHandler.VerifyPortal)
			publicGroup.POST("/register-track", publicHandler.RegisterLead)
		}

		// Auth Module
		authHandler := auth.NewAuthHandler(db, jwtSecret)
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/login", authHandler.Login)
			authGroup.POST("/register", authHandler.Register)
			authGroup.GET("/check-pageid", authHandler.CheckPageID)
		}

		// Settings Module
		settingsHandler := settings.NewSettingsHandler(db, cld)
		settingsGroup := api.Group("/settings")
		settingsGroup.Use(middleware.AuthGuard(jwtSecret))
		{
			settingsGroup.GET("/", settingsHandler.GetProfile)
			settingsGroup.PUT("/", settingsHandler.UpdateProfile)
			settingsGroup.PATCH("/password", settingsHandler.ChangePassword)
		}

		// Overview Module
		overviewHandler := overview.NewOverviewHandler(db)
		overviewGroup := api.Group("/overview")
		overviewGroup.Use(middleware.AuthGuard(jwtSecret))
		{
			overviewGroup.GET("/", overviewHandler.GetDashboard)
			overviewGroup.POST("/leads/export-vcf", overviewHandler.ExportVCF)
			overviewGroup.POST("/leads/bulk-delete", overviewHandler.BulkDeleteLeads)
			overviewGroup.DELETE("/leads/:id", overviewHandler.DeleteLead)
		}

		// Admin Module
		adminHandler := admin.NewAdminHandler(db, cld)
		adminGroup := api.Group("/admin")
		adminGroup.Use(middleware.AuthGuard(jwtSecret))
		adminGroup.Use(middleware.AdminGuard())
		{
			adminGroup.GET("/pgbo", adminHandler.GetPGBO)
			adminGroup.POST("/pgbo", adminHandler.CreatePGBO)
			adminGroup.PATCH("/pgbo/:id/toggle", adminHandler.TogglePGBO)
			adminGroup.PUT("/pgbo/:id", adminHandler.UpdatePGBO)
			adminGroup.POST("/pgbo/bulk-delete", adminHandler.BulkDeletePGBO)
			adminGroup.PATCH("/pgbo/bulk-toggle", adminHandler.BulkTogglePGBO)
			adminGroup.GET("/settings/secret-code", adminHandler.GetSecretCode)
			adminGroup.PATCH("/settings/secret-code", adminHandler.UpdateSecretCode)
		}
	}

	return r
}
