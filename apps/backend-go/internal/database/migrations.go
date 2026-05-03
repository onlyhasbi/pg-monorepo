package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

func SetupDatabase(db *sql.DB) error {
	// 1. Create Users table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			role TEXT NOT NULL DEFAULT 'pgbo',
			pgcode TEXT UNIQUE,
			email TEXT UNIQUE,
			katasandi_hash TEXT NOT NULL,
			pageid TEXT UNIQUE,
			foto_profil_url TEXT,
			nama_lengkap TEXT,
			nama_panggilan TEXT,
			no_telpon TEXT,
			link_group_whatsapp TEXT,
			sosmed_facebook TEXT,
			sosmed_instagram TEXT,
			sosmed_tiktok TEXT,
			is_active INTEGER NOT NULL DEFAULT 1,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating users table: %v", err)
	}

	// 2. Create Leads table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS leads (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			nama TEXT,
			branch TEXT,
			no_telpon TEXT,
			exported_at DATETIME,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating leads table: %v", err)
	}

	// 3. Create Analytics table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS analytics (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			event_type TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating analytics table: %v", err)
	}

	// 4. Create System Settings table
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS system_settings (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		return fmt.Errorf("error creating system_settings table: %v", err)
	}

	// 5. Initialize default settings
	secretCode := os.Getenv("SECRET_CODE")
	if secretCode == "" {
		secretCode = "unlimited"
	}
	
	_, _ = db.Exec("INSERT OR IGNORE INTO system_settings (key, value) VALUES ('portal_secret_code', ?)", secretCode)
	
	// 6. FTS Indexing (Simplified for Go PoC, but including the triggers for sync)
	_, _ = db.Exec(`CREATE VIRTUAL TABLE IF NOT EXISTS users_fts USING fts5(id UNINDEXED, pgcode, nama_lengkap, pageid, tokenize='trigram')`)
	_, _ = db.Exec(`CREATE TRIGGER IF NOT EXISTS users_ai AFTER INSERT ON users BEGIN INSERT INTO users_fts(id, pgcode, nama_lengkap, pageid) VALUES (new.id, new.pgcode, new.nama_lengkap, new.pageid); END;`)
	
	_, _ = db.Exec(`CREATE VIRTUAL TABLE IF NOT EXISTS leads_fts USING fts5(id UNINDEXED, nama, branch, no_telpon, tokenize='trigram')`)
	_, _ = db.Exec(`CREATE TRIGGER IF NOT EXISTS leads_ai AFTER INSERT ON leads BEGIN INSERT INTO leads_fts(id, nama, branch, no_telpon) VALUES (new.id, new.nama, new.branch, new.no_telpon); END;`)

	log.Println("Database tables verified and migrations completed.")
	return nil
}
