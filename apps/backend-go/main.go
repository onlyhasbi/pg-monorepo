package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	_ "modernc.org/sqlite"
	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/app"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/database"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	driverName := "libsql"
	if strings.HasPrefix(dbURL, "file:") {
		driverName = "sqlite"
	}

	db, err := sql.Open(driverName, dbURL)
	if err != nil {
		log.Fatalf("Error connecting to database (%s): %v", driverName, err)
	}
	defer db.Close()

	// Connection Pool Settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Run Database Migrations
	if err := database.SetupDatabase(db); err != nil {
		log.Fatalf("Database setup failed: %v", err)
	}

	// Cloudinary Setup
	cld, err := cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		log.Fatalf("Error connecting to Cloudinary: %v", err)
	}

	// Initialize Gin Engine using shared setup
	r := app.SetupRouter(db, cld)

	// Server Configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Graceful Shutdown
	go func() {
		log.Printf("Server starting on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
