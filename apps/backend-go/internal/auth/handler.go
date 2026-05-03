package auth

import (
	"database/sql"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/models"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	DB        *sql.DB
	JWTSecret string
}

func NewAuthHandler(db *sql.DB, secret string) *AuthHandler {
	return &AuthHandler{DB: db, JWTSecret: secret}
}

func (h *AuthHandler) CheckPageID(c *gin.Context) {
	pageid := utils.SanitizePageId(c.Query("pageid"))
	if len(pageid) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Page ID tidak valid"})
		return
	}

	var count int
	err := h.DB.QueryRow("SELECT COUNT(*) FROM users WHERE pageid = ?", pageid).Scan(&count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "isAvailable": count == 0})
}

type RegisterRequest struct {
	Role         string `json:"role"`
	PGCode       string `json:"pgcode"`
	PageID       string `json:"pageid"`
	Email        string `json:"email"`
	Katasandi    string `json:"katasandi" binding:"required"`
	SecretCode   string `json:"secretCode"`
	NamaLengkap  string `json:"nama_lengkap"`
	NoTelpon     string `json:"no_telpon"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	if len(req.Katasandi) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Katasandi minimal 6 karakter"})
		return
	}

	id := uuid.New().String()
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Katasandi), bcrypt.DefaultCost)

	if req.Role == "admin" {
		if req.Email == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Email wajib diisi untuk admin"})
			return
		}
		if req.SecretCode != os.Getenv("SECRET_CODE") {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Secret code tidak valid"})
			return
		}

		_, err := h.DB.Exec("INSERT INTO users (id, role, email, katasandi_hash) VALUES (?, ?, ?, ?)", id, req.Role, req.Email, string(hashedPassword))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Email sudah terdaftar"})
			return
		}

		token, _ := h.signToken(req.Email, id, req.Role)
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Registrasi admin berhasil", "token": token, "user": gin.H{"id": id, "email": req.Email, "role": req.Role}})
	} else {
		pgcode := utils.SanitizePGCode(req.PGCode)
		pageid := utils.SanitizePageId(req.PageID)

		if len(pgcode) < 3 || len(pageid) < 3 {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "PGCode atau Page ID tidak valid"})
			return
		}

		_, err := h.DB.Exec("INSERT INTO users (id, role, pgcode, pageid, katasandi_hash, nama_lengkap, no_telpon) VALUES (?, 'pgbo', ?, ?, ?, ?, ?)",
			id, pgcode, pageid, string(hashedPassword), req.NamaLengkap, req.NoTelpon)
		
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "PGCode atau Page ID sudah terdaftar"})
			return
		}

		token, _ := h.signToken(pgcode, id, "pgbo")
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Registrasi agen berhasil", "token": token, "user": gin.H{"id": id, "pgcode": pgcode, "pageid": pageid, "role": "pgbo"}})
	}
}

func (h *AuthHandler) signToken(sub, id, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  sub,
		"id":   id,
		"role": role,
		"exp":  time.Now().Add(7 * 24 * time.Hour).Unix(),
	})
	return token.SignedString([]byte(h.JWTSecret))
}


type LoginRequest struct {
	Identifier string `json:"identifier" binding:"required"`
	Katasandi  string `json:"katasandi" binding:"required"`
}

// Login godoc
// @Summary      Login as Agent or Admin
// @Description  Authenticate user and return JWT token
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body  body      LoginRequest  true  "Credentials"
// @Success      200   {object}  models.AuthResponse
// @Router       /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.AuthResponse{
			Success: false,
			Message: "Email atau PGCode tidak valid",
		})
		return
	}

	identifier := strings.TrimSpace(req.Identifier)
	
	// Query user
	var user models.User
	var katasandiHash string
	
	query := `SELECT id, role, pgcode, email, pageid, katasandi_hash, is_active FROM users WHERE email = ? OR UPPER(pgcode) = UPPER(?) LIMIT 1`
	err := h.DB.QueryRow(query, identifier, identifier).Scan(
		&user.ID, &user.Role, &user.PGCode, &user.Email, &user.PageID, &katasandiHash, &user.IsActive,
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{
			Success: false,
			Message: "Kredensial salah",
		})
		return
	}

	// Verify password (Note: We need to ensure bcrypt matches Bun's hash)
	if err := bcrypt.CompareHashAndPassword([]byte(katasandiHash), []byte(req.Katasandi)); err != nil {
		c.JSON(http.StatusUnauthorized, models.AuthResponse{
			Success: false,
			Message: "Kredensial salah",
		})
		return
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  identifier,
		"id":   user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24 * 7).Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.AuthResponse{
			Success: false,
			Message: "Gagal membuat token",
		})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Success: true,
		Message: "Login berhasil",
		Token:   tokenString,
		User:    user,
	})
}
