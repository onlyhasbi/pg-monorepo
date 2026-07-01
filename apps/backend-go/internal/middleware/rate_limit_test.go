package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/middleware"
	"github.com/stretchr/testify/assert"
)

func TestRateLimit(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	
	// Set rate limit to 2 requests per minute
	router.Use(middleware.RateLimit(2, time.Minute))
	router.GET("/test", func(c *gin.Context) {
		c.String(http.StatusOK, "ok")
	})

	// First request should pass
	req1, _ := http.NewRequest("GET", "/test", nil)
	w1 := httptest.NewRecorder()
	router.ServeHTTP(w1, req1)
	assert.Equal(t, http.StatusOK, w1.Code)

	// Second request should pass
	req2, _ := http.NewRequest("GET", "/test", nil)
	w2 := httptest.NewRecorder()
	router.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusOK, w2.Code)

	// Third request should be rate limited
	req3, _ := http.NewRequest("GET", "/test", nil)
	w3 := httptest.NewRecorder()
	router.ServeHTTP(w3, req3)
	assert.Equal(t, http.StatusTooManyRequests, w3.Code)
}
