package models

import "time"

type User struct {
	ID                string    `json:"id" db:"id"`
	Role              string    `json:"role" db:"role"`
	PGCode            *string   `json:"pgcode" db:"pgcode"`
	Email             *string   `json:"email" db:"email"`
	PageID            *string   `json:"pageid" db:"pageid"`
	KatasandiHash    string    `json:"-" db:"katasandi_hash"`
	FotoProfilURL     *string   `json:"foto_profil_url" db:"foto_profil_url"`
	NamaLengkap       *string   `json:"nama_lengkap" db:"nama_lengkap"`
	NamaPanggilan     *string   `json:"nama_panggilan" db:"nama_panggilan"`
	NoTelpon          *string   `json:"no_telpon" db:"no_telpon"`
	LinkGroupWhatsApp *string   `json:"link_group_whatsapp" db:"link_group_whatsapp"`
	SosmedFacebook    *string   `json:"sosmed_facebook" db:"sosmed_facebook"`
	SosmedInstagram   *string   `json:"sosmed_instagram" db:"sosmed_instagram"`
	SosmedTiktok      *string   `json:"sosmed_tiktok" db:"sosmed_tiktok"`
	IsActive          bool      `json:"is_active" db:"is_active"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
}

type AuthResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Token   string      `json:"token,omitempty"`
	User    interface{} `json:"user,omitempty"`
}
