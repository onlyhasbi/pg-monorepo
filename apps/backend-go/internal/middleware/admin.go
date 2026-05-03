package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminGuard() gin.HandlerFunc {
	return func(c *gin.Context) {
		userClaims, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Akses ditolak"})
			c.Abort()
			return
		}

		claims := userClaims.(*UserClaims)
		if claims.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Akses khusus admin"})
			c.Abort()
			return
		}

		c.Next()
	}
}
