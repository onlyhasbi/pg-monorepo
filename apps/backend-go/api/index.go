package handler

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/cloudinary/cloudinary-go/v2"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
	_ "modernc.org/sqlite"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/app"
)

var (
	db   *sql.DB
	cld  *cloudinary.Cloudinary
	once sync.Once
)

func initApp() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	driverName := "libsql"
	if strings.HasPrefix(dbURL, "file:") {
		driverName = "sqlite"
	}

	var err error
	db, err = sql.Open(driverName, dbURL)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	cld, err = cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		log.Fatalf("Error connecting to Cloudinary: %v", err)
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(initApp)

	// Initialize Gin Engine using shared setup
	engine := app.SetupRouter(db, cld)

	// Serve Request
	engine.ServeHTTP(w, r)
}
