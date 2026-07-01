package auth_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/testutils"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestAuthRoutes(t *testing.T) {
	db := testutils.SetupTestDB()
	router := testutils.SetupTestRouter(db)

	t.Run("should check pageid availability", func(t *testing.T) {
		// Insert a taken pageid
		_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash) VALUES ('auth-id-1', 'pgbo', 'PGAUTH1', 'takenpage', 'hash')`)
		assert.NoError(t, err)

		// Check taken pageid
		req, _ := http.NewRequest("GET", "/api/auth/check-pageid?pageid=takenpage", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var resTaken map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &resTaken)
		assert.Equal(t, false, resTaken["isAvailable"])

		// Check available pageid
		req2, _ := http.NewRequest("GET", "/api/auth/check-pageid?pageid=freepage", nil)
		w2 := httptest.NewRecorder()
		router.ServeHTTP(w2, req2)

		assert.Equal(t, http.StatusOK, w2.Code)
		var resAvail map[string]interface{}
		json.Unmarshal(w2.Body.Bytes(), &resAvail)
		assert.Equal(t, true, resAvail["isAvailable"])
	})

	t.Run("should register a new pgbo", func(t *testing.T) {
		payload := map[string]string{
			"role":         "pgbo",
			"pgcode":       "PGAUTH2",
			"pageid":       "newpage",
			"katasandi":    "password123",
			"nama_lengkap": "Test Agent",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		assert.NotNil(t, res["token"])
		
		user := res["user"].(map[string]interface{})
		assert.Equal(t, "PGAUTH2", user["pgcode"])
	})

	t.Run("should register a new admin with valid secret", func(t *testing.T) {
		os.Setenv("SECRET_CODE", "unlimited")
		defer os.Unsetenv("SECRET_CODE")
		
		payload := map[string]string{
			"role":       "admin",
			"email":      "admin@example.com",
			"katasandi":  "adminpass",
			"secretCode": "unlimited", // the default secret set in db migrations
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		if w.Code == http.StatusOK {
			var res map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &res)
			assert.Equal(t, true, res["success"])
			assert.NotNil(t, res["token"])
			
			user := res["user"].(map[string]interface{})
			assert.Equal(t, "admin", user["role"])
		}
	})

	t.Run("should fail admin registration with invalid secret", func(t *testing.T) {
		payload := map[string]string{
			"role":       "admin",
			"email":      "fakeadmin@example.com",
			"katasandi":  "adminpass",
			"secretCode": "wrong_secret",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code) // Should be 401
	})

	t.Run("should login a user", func(t *testing.T) {
		hashed, _ := utils.HashPassword("mypassword")
		_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash) VALUES ('auth-id-login', 'pgbo', 'PGLOGIN', 'loginpage', ?)`, hashed)
		assert.NoError(t, err)

		payload := map[string]string{
			"identifier": "PGLOGIN",
			"katasandi":  "mypassword",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		if w.Code == http.StatusOK {
			var res map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &res)
			assert.Equal(t, true, res["success"])
			assert.NotNil(t, res["token"])
			
			user := res["user"].(map[string]interface{})
			assert.Equal(t, "PGLOGIN", user["pgcode"])
		}
	})

	t.Run("should reject login with wrong password", func(t *testing.T) {
		hashed, _ := utils.HashPassword("mypassword")
		_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash) VALUES ('auth-id-fail', 'pgbo', 'PGFAIL', 'failpage', ?)`, hashed)
		assert.NoError(t, err)

		payload := map[string]string{
			"identifier": "PGFAIL",
			"katasandi":  "wrongpassword",
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
