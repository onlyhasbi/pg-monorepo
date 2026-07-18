package settings

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

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
	query := `SELECT pgcode, pageid, foto_profil_url, nama_lengkap, nama_panggilan, email, no_telpon, link_group_whatsapp, link_group_edukasi, sosmed_facebook, sosmed_instagram, sosmed_tiktok FROM users WHERE id = ?`
	
	err := h.DB.QueryRow(query, user.ID).Scan(
		&profile.PGCode, &profile.PageID, &profile.FotoProfilURL, &profile.NamaLengkap,
		&profile.NamaPanggilan, &profile.Email, &profile.NoTelpon, &profile.LinkGroupWhatsApp, &profile.LinkGroupEdukasi,
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
	LinkGroupEdukasi  *string `form:"link_group_edukasi"`
	SosmedFacebook    *string `form:"sosmed_facebook"`
	SosmedInstagram   *string `form:"sosmed_instagram"`
	SosmedTiktok      *string `form:"sosmed_tiktok"`
	FotoProfilURL     *string `form:"foto_profil_url"`
}

func (h *SettingsHandler) UpdateProfile(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	// Ambil data manual untuk menghindari error binding multipart
	namaLengkap := c.PostForm("nama_lengkap")
	namaPanggilan := c.PostForm("nama_panggilan")
	email := c.PostForm("email")
	noTelpon := c.PostForm("no_telpon")
	linkWA := c.PostForm("link_group_whatsapp")
	linkEdukasi := c.PostForm("link_group_edukasi")
	sosmedFB := c.PostForm("sosmed_facebook")
	sosmedIG := c.PostForm("sosmed_instagram")
	sosmedTiktok := c.PostForm("sosmed_tiktok")

	var photoURL sql.NullString

	header, err := c.FormFile("foto_profil")
	if err == nil {
		file, err := header.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Gagal membuka file gambar"})
			return
		}
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
		photoURL = sql.NullString{String: uploadRes.SecureURL, Valid: true}
	}

	// Update DB - Gunakan data yang diambil manual
	query := `
		UPDATE users SET 
			foto_profil_url = COALESCE(?, foto_profil_url),
			nama_lengkap = CASE WHEN ? != '' THEN ? ELSE nama_lengkap END,
			nama_panggilan = ?,
			email = CASE WHEN ? != '' THEN ? ELSE email END,
			no_telpon = CASE WHEN ? != '' THEN ? ELSE no_telpon END,
			link_group_whatsapp = ?,
			link_group_edukasi = ?,
			sosmed_facebook = ?,
			sosmed_instagram = ?,
			sosmed_tiktok = ?
		WHERE id = ?
	`
	res, err := h.DB.Exec(query, 
		photoURL, 
		namaLengkap, namaLengkap,
		namaPanggilan,
		email, email,
		noTelpon, noTelpon,
		linkWA,
		linkEdukasi,
		sosmedFB,
		sosmedIG,
		sosmedTiktok,
		user.ID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal update database"})
		return
	}

	rows, _ := res.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusOK, gin.H{"success": false, "message": "Tidak ada data yang diperbarui. Pastikan data berbeda atau User ID benar."})
		return
	}

	// Add cache buster to debug URL
	finalURL := photoURL.String
	if photoURL.Valid {
		finalURL = fmt.Sprintf("%s?v=%d", finalURL, time.Now().Unix())
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true, 
		"message": "Profil berhasil diperbarui",
		"debug": gin.H{
			"new_url": finalURL,
			"updated": photoURL.Valid,
		},
	})
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
