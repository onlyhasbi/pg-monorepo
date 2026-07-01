package admin_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/testutils"
	"github.com/stretchr/testify/assert"
)

func generateAdminToken() string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  "admin@test.com",
		"id":   "admin-123",
		"role": "admin",
		"exp":  time.Now().Add(time.Hour).Unix(),
	})
	// Assuming JWT_SECRET is empty in test or not set, so empty secret
	tokenString, _ := token.SignedString([]byte(""))
	return tokenString
}

func TestAdminRoutes(t *testing.T) {
	db := testutils.SetupTestDB()
	router := testutils.SetupTestRouter(db)

	_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash, nama_lengkap) VALUES ('pgbo-user', 'pgbo', 'PGBO', 'pgbopage', 'hash', 'PGBO User')`)
	assert.NoError(t, err)

	_, err = db.Exec(`INSERT INTO users (id, role, email, katasandi_hash) VALUES ('admin-123', 'admin', 'admin@test.com', 'hash')`)
	assert.NoError(t, err)

	token := generateAdminToken()

	t.Run("should get pgbo list", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/admin/pgbo", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		assert.NotNil(t, res["data"])
	})

	t.Run("should reject without token", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/admin/pgbo", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)
		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})

	t.Run("should get secret code", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/admin/settings/secret-code", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("should update secret code", func(t *testing.T) {
		payload := map[string]interface{}{
			"code": "newsecret123",
			"auto_rotate": false,
		}
		body, _ := json.Marshal(payload)
		req, _ := http.NewRequest("PATCH", "/api/admin/settings/secret-code", bytes.NewBuffer(body))
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/json")
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("should get admin profile", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/admin/profile", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		data := res["data"].(map[string]interface{})
		assert.Equal(t, "admin-123", data["id"])
	})

	t.Run("should check pageid availability with excludeId", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/admin/pgbo/check-pageid?pageid=pgbopage&excludeId=pgbo-user", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		assert.Equal(t, true, res["isAvailable"]) // Available because we exclude the owner
	})

	t.Run("should delete pgbo", func(t *testing.T) {
		req, _ := http.NewRequest("DELETE", "/api/admin/pgbo/pgbo-user", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
	})
}
