package testutils

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/app"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/database"
	_ "modernc.org/sqlite"
)

// SetupTestDB initializes an in-memory SQLite database and applies migrations.
func SetupTestDB() *sql.DB {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		log.Fatalf("Failed to open test database: %v", err)
	}

	// Apply migrations
	if err := database.SetupDatabase(db); err != nil {
		log.Fatalf("Failed to setup test database: %v", err)
	}

	return db
}

// SetupTestRouter initializes the Gin engine for testing.
func SetupTestRouter(db *sql.DB) *gin.Engine {
	gin.SetMode(gin.TestMode)
	// Passing nil for cloudinary as tests usually mock it or avoid it
	return app.SetupRouter(db, nil)
}
