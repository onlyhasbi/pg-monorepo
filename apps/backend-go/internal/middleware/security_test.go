package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/middleware"
	"github.com/stretchr/testify/assert"
)

func TestSecurityHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(middleware.SecurityHeaders())
	router.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	req, _ := http.NewRequest("GET", "/test", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	
	// Check headers
	headers := w.Header()
	assert.Equal(t, "1; mode=block", headers.Get("X-XSS-Protection"))
	assert.Equal(t, "DENY", headers.Get("X-Frame-Options"))
	assert.Equal(t, "nosniff", headers.Get("X-Content-Type-Options"))
	assert.Equal(t, "strict-origin-when-cross-origin", headers.Get("Referrer-Policy"))
	assert.Equal(t, "camera=(), microphone=(), geolocation=()", headers.Get("Permissions-Policy"))
}
