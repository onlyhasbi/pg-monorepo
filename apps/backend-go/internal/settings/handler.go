package settings

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/middleware"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/models"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
)

type SettingsHandler struct {
	DB         *sql.DB
	Cloudinary *cloudinary.Cloudinary
}

func NewSettingsHandler(db *sql.DB, cld *cloudinary.Cloudinary) *SettingsHandler {
	return &SettingsHandler{DB: db, Cloudinary: cld}
}

func (h *SettingsHandler) GetProfile(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	var profile models.User
	query := `SELECT pgcode, pageid, foto_profil_url, nama_lengkap, nama_panggilan, email, no_telpon, link_group_whatsapp, sosmed_facebook, sosmed_instagram, sosmed_tiktok FROM users WHERE id = ?`
	
	err := h.DB.QueryRow(query, user.ID).Scan(
		&profile.PGCode, &profile.PageID, &profile.FotoProfilURL, &profile.NamaLengkap,
		&profile.NamaPanggilan, &profile.Email, &profile.NoTelpon, &profile.LinkGroupWhatsApp,
		&profile.SosmedFacebook, &profile.SosmedInstagram, &profile.SosmedTiktok,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Agent tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": profile})
}

type UpdateProfileRequest struct {
	NamaLengkap       *string `form:"nama_lengkap"`
	NamaPanggilan     *string `form:"nama_panggilan"`
	Email             *string `form:"email"`
	NoTelpon          *string `form:"no_telpon"`
	LinkGroupWhatsApp *string `form:"link_group_whatsapp"`
	SosmedFacebook    *string `form:"sosmed_facebook"`
	SosmedInstagram   *string `form:"sosmed_instagram"`
	SosmedTiktok      *string `form:"sosmed_tiktok"`
	FotoProfilURL     *string `form:"foto_profil_url"`
}

func (h *SettingsHandler) UpdateProfile(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	var req UpdateProfileRequest
	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	photoURL := req.FotoProfilURL

	// Handle Image Upload
	file, header, err := c.Request.FormFile("foto_profil")
	if err == nil {
		defer file.Close()
		
		// Process Image (Resize & WebP)
		processed, err := utils.ProcessImage(file, header.Filename, header.Header.Get("Content-Type"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Gagal memproses gambar"})
			return
		}

		// Upload to Cloudinary
		ctx := context.Background()
		uploadRes, err := h.Cloudinary.Upload.Upload(ctx, processed.Buffer, uploader.UploadParams{
			Folder: "profile_pictures",
			Format: "webp",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal upload ke Cloudinary"})
			return
		}
		photoURL = &uploadRes.SecureURL
	}

	// Update DB
	query := `
		UPDATE users SET 
			foto_profil_url = COALESCE(?, foto_profil_url),
			nama_lengkap = COALESCE(?, nama_lengkap),
			nama_panggilan = COALESCE(?, nama_panggilan),
			email = COALESCE(?, email),
			no_telpon = COALESCE(?, no_telpon),
			link_group_whatsapp = COALESCE(?, link_group_whatsapp),
			sosmed_facebook = COALESCE(?, sosmed_facebook),
			sosmed_instagram = COALESCE(?, sosmed_instagram),
			sosmed_tiktok = COALESCE(?, sosmed_tiktok)
		WHERE id = ?
	`
	_, err = h.DB.Exec(query, 
		photoURL, req.NamaLengkap, req.NamaPanggilan, req.Email, 
		req.NoTelpon, req.LinkGroupWhatsApp, req.SosmedFacebook, 
		req.SosmedInstagram, req.SosmedTiktok, user.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal update database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Profil berhasil diperbarui"})
}

type ChangePasswordRequest struct {
	KatasandiLama string `json:"katasandi_lama" binding:"required"`
	KatasandiBaru string `json:"katasandi_baru" binding:"required"`
}

func (h *SettingsHandler) ChangePassword(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	var currentHash string
	err := h.DB.QueryRow("SELECT katasandi_hash FROM users WHERE id = ?", user.ID).Scan(&currentHash)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Agent tidak ditemukan"})
		return
	}

	match, err := utils.VerifyPassword(req.KatasandiLama, currentHash)
	if err != nil || !match {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Katasandi lama salah"})
		return
	}

	newHash, err := utils.HashPassword(req.KatasandiBaru)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal memproses katasandi baru"})
		return
	}

	// Update DB
	_, err = h.DB.Exec("UPDATE users SET katasandi_hash = ? WHERE id = ?", string(newHash), user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal update katasandi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Katasandi berhasil diperbarui"})
}
