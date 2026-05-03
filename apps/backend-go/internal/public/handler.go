package public

import (
	"database/sql"
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/database"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/models"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/services"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
)

type PublicHandler struct {
	DB               *sql.DB
	GoldPriceService *services.GoldPriceService
}

func NewPublicHandler(db *sql.DB, gps *services.GoldPriceService) *PublicHandler {
	return &PublicHandler{DB: db, GoldPriceService: gps}
}

func (h *PublicHandler) GetAgentProfile(c *gin.Context) {
	pageid := c.Param("pageid")

	var profile models.User
	query := `
		SELECT 
			pgcode, pageid, nama_lengkap, nama_panggilan, email, 
			no_telpon, link_group_whatsapp, 
			sosmed_facebook, sosmed_instagram, sosmed_tiktok, 
			foto_profil_url 
		FROM users 
		WHERE role = 'pgbo' AND pageid = ? AND is_active = 1
	`
	err := h.DB.QueryRow(query, pageid).Scan(
		&profile.PGCode, &profile.PageID, &profile.NamaLengkap, &profile.NamaPanggilan, &profile.Email,
		&profile.NoTelpon, &profile.LinkGroupWhatsApp,
		&profile.SosmedFacebook, &profile.SosmedInstagram, &profile.SosmedTiktok,
		&profile.FotoProfilURL,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Page ID tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": profile})
}

func (h *PublicHandler) GetAgentVCard(c *gin.Context) {
	pageid := c.Param("pageid")

	var nama, branch, noTelpon string
	query := `SELECT nama_lengkap, pgcode, no_telpon FROM users WHERE pageid = ? AND is_active = 1`
	err := h.DB.QueryRow(query, pageid).Scan(&nama, &branch, &noTelpon)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Agent tidak ditemukan"})
		return
	}

	vcardContent := utils.GenerateVCardFile([]utils.LeadData{
		{Nama: nama, Branch: branch, NoTelpon: noTelpon},
	})

	c.Header("Content-Type", "text/vcard; charset=utf-8")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"kontak-%s.vcf\"", pageid))
	c.String(http.StatusOK, vcardContent)
}

func (h *PublicHandler) GetAgentsList(c *gin.Context) {
	rows, err := h.DB.Query("SELECT pageid, nama_panggilan, foto_profil_url FROM users WHERE role = 'pgbo' AND is_active = 1")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Terjadi kesalahan pada server"})
		return
	}
	defer rows.Close()

	var agents []map[string]interface{}
	for rows.Next() {
		var pageid, namaPanggilan, fotoURL sql.NullString
		rows.Scan(&pageid, &namaPanggilan, &fotoURL)
		
		agent := map[string]interface{}{
			"pageid":          pageid.String,
			"nama_panggilan":  namaPanggilan.String,
			"foto_profil_url": fotoURL.String,
		}
		agents = append(agents, agent)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": agents})
}

func (h *PublicHandler) GetRandomAgent(c *gin.Context) {
	var profile models.User
	query := `
		SELECT 
			nama_lengkap, nama_panggilan, pageid, foto_profil_url, no_telpon
		FROM users 
		WHERE role = 'pgbo' AND is_active = 1
		ORDER BY RANDOM()
		LIMIT 1
	`
	err := h.DB.QueryRow(query).Scan(
		&profile.NamaLengkap, &profile.NamaPanggilan, &profile.PageID, &profile.FotoProfilURL, &profile.NoTelpon,
	)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "No active PGBO found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": profile})
}

func (h *PublicHandler) GetGoldPrices(c *gin.Context) {
	data, err := h.GoldPriceService.FetchGoldPrices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil data harga emas"})
		return
	}

	c.Header("Cache-Control", "public, max-age=120, s-maxage=120")
	c.JSON(http.StatusOK, gin.H{"success": true, "data": data})
}

type TrackAnalyticsRequest struct {
	PageID string `json:"pageid" binding:"required"`
	Event  string `json:"event" binding:"required"`
}

func (h *PublicHandler) TrackAnalytics(c *gin.Context) {
	var req TrackAnalyticsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	// Get agent internal ID
	var agentID string
	err := h.DB.QueryRow("SELECT id FROM users WHERE pageid = ? AND is_active = 1 LIMIT 1", req.PageID).Scan(&agentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Agent tidak ditemukan"})
		return
	}

	id := uuid.New().String()
	_, err = h.DB.Exec("INSERT INTO analytics (id, user_id, event_type) VALUES (?, ?, ?)", id, agentID, req.Event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menyimpan analytics"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

type RegisterLeadRequest struct {
	PageID   string `json:"pageid" binding:"required"`
	Nama     string `json:"nama" binding:"required"`
	Branch   string `json:"branch" binding:"required"`
	NoTelpon string `json:"no_telpon" binding:"required"`
}

func (h *PublicHandler) RegisterLead(c *gin.Context) {
	var req RegisterLeadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Data tidak valid"})
		return
	}

	var agentID string
	err := h.DB.QueryRow("SELECT id FROM users WHERE pageid = ? AND is_active = 1 LIMIT 1", req.PageID).Scan(&agentID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Agent tidak ditemukan"})
		return
	}

	id := uuid.New().String()
	_, err = h.DB.Exec("INSERT INTO leads (id, user_id, nama, branch, no_telpon) VALUES (?, ?, ?, ?, ?)", id, agentID, req.Nama, req.Branch, req.NoTelpon)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menyimpan pendaftar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Lead tracked successfully"})
}

func (h *PublicHandler) VerifyPortal(c *gin.Context) {
	var req struct {
		Code string `json:"code" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Kode wajib diisi"})
		return
	}

	rawSecret, _ := database.GetSetting(h.DB, "portal_secret_code")
	
	normalize := func(s string) string {
		return strings.ToLower(regexp.MustCompile(`[^a-zA-Z0-9]`).ReplaceAllString(s, ""))
	}

	if normalize(req.Code) == normalize(rawSecret) {
		c.JSON(http.StatusOK, gin.H{"success": true})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Kode rahasia tidak valid"})
	}
}
