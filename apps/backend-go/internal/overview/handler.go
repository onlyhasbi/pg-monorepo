package overview

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/middleware"
	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
)

type OverviewHandler struct {
	DB *sql.DB
}

func NewOverviewHandler(db *sql.DB) *OverviewHandler {
	return &OverviewHandler{DB: db}
}

func (h *OverviewHandler) GetDashboard(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	// 1. Get Stats
	var totalVisitors, totalWA, totalLeads int
	
	h.DB.QueryRow("SELECT COUNT(*) FROM analytics WHERE user_id = ? AND event_type = 'visitor'", user.ID).Scan(&totalVisitors)
	h.DB.QueryRow("SELECT COUNT(*) FROM analytics WHERE user_id = ? AND event_type = 'whatsapp_click'", user.ID).Scan(&totalWA)
	h.DB.QueryRow("SELECT COUNT(*) FROM leads WHERE user_id = ?", user.ID).Scan(&totalLeads)

	// 2. Get Leads Table
	search := c.Query("search")
	query := `SELECT id, nama, branch, no_telpon, exported_at, created_at FROM leads WHERE user_id = ?`
	var args []interface{}
	args = append(args, user.ID)

	if search != "" {
		query += " AND (nama LIKE ? OR branch LIKE ? OR no_telpon LIKE ?)"
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern)
	}
	query += " ORDER BY created_at DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil data pendaftar"})
		return
	}
	defer rows.Close()

	type Lead struct {
		ID         string  `json:"id"`
		Nama       string  `json:"nama"`
		Branch     string  `json:"branch"`
		NoTelpon   string  `json:"no_telpon"`
		ExportedAt *string `json:"exported_at"`
		CreatedAt  string  `json:"created_at"`
	}

	leads := []Lead{}
	for rows.Next() {
		var l Lead
		rows.Scan(&l.ID, &l.Nama, &l.Branch, &l.NoTelpon, &l.ExportedAt, &l.CreatedAt)
		leads = append(leads, l)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_pengunjung":        totalVisitors,
			"total_klik_whatsapp":     totalWA,
			"total_pendaftar":         totalLeads,
			"tabel_pendaftar_terbaru": leads,
		},
	})
}

type ExportVCFRequest struct {
	IDs []string `json:"ids" binding:"required"`
}

func (h *OverviewHandler) ExportVCF(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	var req ExportVCFRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "ID tidak valid"})
		return
	}

	// Fetch leads
	placeholders := []string{}
	args := []interface{}{user.ID}
	for _, id := range req.IDs {
		placeholders = append(placeholders, "?")
		args = append(args, id)
	}

	query := "SELECT nama, branch, no_telpon FROM leads WHERE user_id = ? AND id IN (" + strings.Join(placeholders, ",") + ")"
	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal mengambil data kontak"})
		return
	}
	defer rows.Close()

	vcardLeads := []utils.LeadData{}
	for rows.Next() {
		var l utils.LeadData
		rows.Scan(&l.Nama, &l.Branch, &l.NoTelpon)
		vcardLeads = append(vcardLeads, l)
	}

	if len(vcardLeads) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Data tidak ditemukan"})
		return
	}

	vcfContent := utils.GenerateVCardFile(vcardLeads)

	// Mark as exported
	updateQuery := "UPDATE leads SET exported_at = CURRENT_TIMESTAMP WHERE user_id = ? AND id IN (" + strings.Join(placeholders, ",") + ")"
	h.DB.Exec(updateQuery, args...)

	c.Header("Content-Type", "text/vcard; charset=utf-8")
	c.Header("Content-Disposition", "attachment; filename=\"kontak-pendaftar.vcf\"")
	c.String(http.StatusOK, vcfContent)
}

func (h *OverviewHandler) BulkDeleteLeads(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)

	var req struct {
		IDs []string `json:"ids" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "ID tidak valid"})
		return
	}

	placeholders := []string{}
	args := []interface{}{user.ID}
	for _, id := range req.IDs {
		placeholders = append(placeholders, "?")
		args = append(args, id)
	}

	query := "DELETE FROM leads WHERE user_id = ? AND id IN (" + strings.Join(placeholders, ",") + ")"
	res, err := h.DB.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menghapus pendaftar"})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	c.JSON(http.StatusOK, gin.H{"success": true, "message": fmt.Sprintf("%d pendaftar berhasil dihapus", rowsAffected)})
}

func (h *OverviewHandler) DeleteLead(c *gin.Context) {
	userClaims, _ := c.Get("user")
	user := userClaims.(*middleware.UserClaims)
	id := c.Param("id")

	res, err := h.DB.Exec("DELETE FROM leads WHERE id = ? AND user_id = ?", id, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Gagal menghapus pendaftar"})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Data pendaftar tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Pendaftar berhasil dihapus"})
}

