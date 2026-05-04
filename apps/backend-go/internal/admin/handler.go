package admin

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/database"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/models"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
)

type AdminHandler struct {
	DB         *sql.DB
	Cloudinary *cloudinary.Cloudinary
}

func NewAdminHandler(db *sql.DB, cld *cloudinary.Cloudinary) *AdminHandler {
	return &AdminHandler{DB: db, Cloudinary: cld}
}

func (h *AdminHandler) GetPGBO(c *gin.Context) {
	search := c.Query("search")
	
	query := `SELECT id, pgcode, pageid, nama_lengkap, email, no_telpon, is_active, created_at FROM users WHERE role = 'pgbo'`
	var args []interface{}

	if search != "" {
		// Note: Simplified search for PoC, real one uses FTS
		query += " AND (nama_lengkap LIKE ? OR pgcode LIKE ? OR email LIKE ?)"
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern)
	}

	query += " ORDER BY created_at DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil data PGBO"})
		return
	}
	defer rows.Close()

	var agents []models.User
	for rows.Next() {
		var u models.User
		err := rows.Scan(&u.ID, &u.PGCode, &u.PageID, &u.NamaLengkap, &u.Email, &u.NoTelpon, &u.IsActive, &u.CreatedAt)
		if err == nil {
			agents = append(agents, u)
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": agents})
}

func (h *AdminHandler) CreatePGBO(c *gin.Context) {
	pgcode := utils.SanitizePGCode(c.PostForm("pgcode"))
	pageid := utils.SanitizePageId(c.PostForm("pageid"))
	katasandi := c.PostForm("katasandi")

	if len(pgcode) < 3 || len(pageid) < 3 || len(katasandi) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	hashedPassword, err := utils.HashPassword(katasandi)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal memproses katasandi"})
		return
	}
	id := uuid.New().String()
	nama := c.PostForm("nama_lengkap")
	noTelpon := c.PostForm("no_telpon")

	var photoURL *string
	header, err := c.FormFile("foto_profil")
	if err == nil {
		file, err := header.Open()
		if err == nil {
			defer file.Close()
			
			processed, err := utils.ProcessImage(file, header.Filename, header.Header.Get("Content-Type"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Gagal memproses gambar: " + err.Error()})
				return
			}
			
			uploadRes, err := h.Cloudinary.Upload.Upload(context.Background(), bytes.NewReader(processed.Buffer), uploader.UploadParams{
				Folder: "profile_pictures",
			})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"success": false, 
					"message": "Gagal upload ke Cloudinary",
					"error": err.Error(),
				})
				return
			}
			photoURL = &uploadRes.SecureURL
		}
	}

	_, err = h.DB.Exec(
		`INSERT INTO users (id, role, pgcode, pageid, katasandi_hash, nama_lengkap, foto_profil_url, no_telpon) VALUES (?, 'pgbo', ?, ?, ?, ?, ?, ?)`,
		id, pgcode, pageid, string(hashedPassword), nama, photoURL, noTelpon,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "PGCode atau Page ID sudah terdaftar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "PGBO berhasil dibuat"})
}

func (h *AdminHandler) TogglePGBO(c *gin.Context) {
	id := c.Param("id")
	
	var currentStatus bool
	err := h.DB.QueryRow("SELECT is_active FROM users WHERE id = ? AND role = 'pgbo'", id).Scan(&currentStatus)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Data PGBO tidak ditemukan"})
		return
	}

	newStatus := !currentStatus
	_, err = h.DB.Exec("UPDATE users SET is_active = ? WHERE id = ?", newStatus, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengubah status"})
		return
	}

	message := "PGBO berhasil diaktifkan"
	if !newStatus {
		message = "PGBO berhasil dinonaktifkan"
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": message, "data": gin.H{"is_active": newStatus}})
}

type UpdatePGBORequest struct {
	NamaLengkap *string `form:"nama_lengkap"`
	PGCode      *string `form:"pgcode"`
	PageID      *string `form:"pageid"`
	NoTelpon    *string `form:"no_telpon"`
}

func (h *AdminHandler) UpdatePGBO(c *gin.Context) {
	id := c.Param("id")
	var req UpdatePGBORequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	photoURL := ""
	file, header, err := c.Request.FormFile("foto_profil")
	if err == nil {
		processed, err := utils.ProcessImage(file, header.Filename, header.Header.Get("Content-Type"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Gagal memproses gambar: " + err.Error()})
			return
		}
		
		uploadRes, err := h.Cloudinary.Upload.Upload(context.Background(), bytes.NewReader(processed.Buffer), uploader.UploadParams{
			Folder: "profile_pictures",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false, 
				"message": "Gagal upload ke Cloudinary",
				"error": err.Error(),
			})
			return
		}
		photoURL = uploadRes.SecureURL
	}

	query := `
		UPDATE users SET 
			nama_lengkap = COALESCE(?, nama_lengkap),
			pgcode = COALESCE(?, pgcode),
			pageid = COALESCE(?, pageid),
			no_telpon = COALESCE(?, no_telpon),
			foto_profil_url = CASE WHEN ? != '' THEN ? ELSE foto_profil_url END
		WHERE id = ? AND role = 'pgbo'
	`
	_, err = h.DB.Exec(query, req.NamaLengkap, req.PGCode, req.PageID, req.NoTelpon, photoURL, photoURL, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal update data PGBO"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Data PGBO berhasil diperbarui"})
}


type BulkIDRequest struct {
	IDs []string `json:"ids" binding:"required"`
}

func (h *AdminHandler) BulkDeletePGBO(c *gin.Context) {
	var req BulkIDRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "ID tidak valid"})
		return
	}

	// For PoC, we'll do individual deletes in a loop or use IN clause
	// Note: Real cleanup would also include Cloudinary images
	placeholders := make([]string, len(req.IDs))
	args := make([]interface{}, len(req.IDs))
	for i, id := range req.IDs {
		placeholders[i] = "?"
		args[i] = id
	}

	query := "DELETE FROM users WHERE role = 'pgbo' AND id IN (" + strings.Join(placeholders, ",") + ")"
	res, err := h.DB.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menghapus data bulk"})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	c.JSON(http.StatusOK, gin.H{"success": true, "message": fmt.Sprintf("%d PGBO berhasil dihapus", rowsAffected)})
}

type BulkToggleRequest struct {
	IDs    []string `json:"ids" binding:"required"`
	Active bool     `json:"active"`
}

func (h *AdminHandler) BulkTogglePGBO(c *gin.Context) {
	var req BulkToggleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	newStatus := 0
	if req.Active {
		newStatus = 1
	}

	placeholders := make([]string, len(req.IDs))
	args := make([]interface{}, len(req.IDs)+1)
	args[0] = newStatus
	for i, id := range req.IDs {
		placeholders[i] = "?"
		args[i+1] = id
	}

	query := "UPDATE users SET is_active = ? WHERE role = 'pgbo' AND id IN (" + strings.Join(placeholders, ",") + ")"
	_, err := h.DB.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengubah status bulk"})
		return
	}

	statusMsg := "dinonaktifkan"
	if req.Active {
		statusMsg = "diaktifkan"
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": fmt.Sprintf("%d PGBO berhasil %s", len(req.IDs), statusMsg)})
}

func (h *AdminHandler) GetSecretCode(c *gin.Context) {
	code, _ := database.GetSetting(h.DB, "portal_secret_code")
	autoRotate, _ := database.GetSetting(h.DB, "portal_secret_auto_rotate")

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"code":        code,
			"auto_rotate": autoRotate == "true",
		},
	})
}

func (h *AdminHandler) UpdateSecretCode(c *gin.Context) {
	var req struct {
		Code       string `json:"code" binding:"required"`
		AutoRotate bool   `json:"auto_rotate"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	cleanCode := strings.ReplaceAll(req.Code, " ", "")
	database.UpdateSetting(h.DB, "portal_secret_code", cleanCode)
	
	rotateVal := "false"
	if req.AutoRotate {
		rotateVal = "true"
	}
	database.UpdateSetting(h.DB, "portal_secret_auto_rotate", rotateVal)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Kode rahasia berhasil diperbarui"})
}

