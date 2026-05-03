package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimitEntry struct {
	Count     int
	ResetTime time.Time
}

var (
	store = make(map[string]*RateLimitEntry)
	mu    sync.Mutex
)

var once sync.Once

func RateLimit(max int, window time.Duration) gin.HandlerFunc {
	// Start cleanup goroutine once
	once.Do(func() {
		go func() {
			for {
				time.Sleep(1 * time.Minute)
				mu.Lock()
				now := time.Now()
				for key, entry := range store {
					if now.After(entry.ResetTime) {
						delete(store, key)
					}
				}
				mu.Unlock()
			}
		}()
	})

	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := ip + ":" + c.Request.URL.Path

		mu.Lock()
		now := time.Now()
		entry, exists := store[key]

		if !exists || now.After(entry.ResetTime) {
			entry = &RateLimitEntry{
				Count:     1,
				ResetTime: now.Add(window),
			}
			store[key] = entry
		} else {
			entry.Count++
		}
		mu.Unlock()

		if entry.Count > max {
			c.JSON(http.StatusTooManyRequests, gin.H{"success": false, "message": "Too many requests"})
			c.Abort()
			return
		}

		c.Next()
	}
}
