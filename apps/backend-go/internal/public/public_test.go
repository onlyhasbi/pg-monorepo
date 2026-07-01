package public_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/testutils"
	"github.com/stretchr/testify/assert"
)

func TestPublicRoutes(t *testing.T) {
	db := testutils.SetupTestDB()
	router := testutils.SetupTestRouter(db)

	// Insert mock user
	_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash, nama_lengkap) VALUES ('public-1', 'pgbo', 'PGPUB', 'pubpage', 'hash', 'Public User')`)
	assert.NoError(t, err)

	t.Run("should get agent profile by pageid", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/public/pgbo/pubpage", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		
		data := res["data"].(map[string]interface{})
		assert.Equal(t, "Public User", data["nama_lengkap"])
	})

	t.Run("should return 404 for unknown pageid", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/public/pgbo/unknown", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusNotFound, w.Code)
	})

	t.Run("should get random agent", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/public/random", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		assert.NotNil(t, res["data"])
	})
}
