package overview_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/testutils"
	"github.com/stretchr/testify/assert"
)

func generateToken(id, role string) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  "test-user",
		"id":   id,
		"role": role,
		"exp":  time.Now().Add(time.Hour).Unix(),
	})
	tokenString, _ := token.SignedString([]byte(""))
	return tokenString
}

func TestOverviewRoutes(t *testing.T) {
	db := testutils.SetupTestDB()
	router := testutils.SetupTestRouter(db)

	_, err := db.Exec(`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash, nama_lengkap) VALUES ('overview-user', 'pgbo', 'PGOVER', 'overpage', 'hash', 'Overview User')`)
	assert.NoError(t, err)

	token := generateToken("overview-user", "pgbo")

	t.Run("should get dashboard data", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/overview/", nil)
		req.Header.Set("Authorization", "Bearer "+token)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		var res map[string]interface{}
		json.Unmarshal(w.Body.Bytes(), &res)
		assert.Equal(t, true, res["success"])
		assert.NotNil(t, res["data"])
	})

	t.Run("should fail if unauthorized", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/api/overview/", nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusUnauthorized, w.Code)
	})
}
