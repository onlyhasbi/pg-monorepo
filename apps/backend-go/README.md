# Backend Go (Public Gold)

Ini adalah layanan Backend API untuk portal Public Gold (Dealer & Admin) yang ditulis menggunakan Golang. API ini menggantikan backend berbasis Elysia (Node/Bun) yang digunakan sebelumnya, dengan tetap mengupayakan kompatibilitas kontrak (API Response) 1:1 terhadap *frontend*.

## Teknologi Utama
- **Go** (Golang)
- **Gin** (Web Framework)
- **SQLite** (Database default via `mattn/go-sqlite3`)
- **JWT** (Otentikasi & Otorisasi)
- **Cloudinary** (Manajemen *Image/Asset*)

## Struktur Direktori
- `/cmd` - Berisi *entry point* CLI atau script jika ada (saat ini `main.go` ada di *root* direktori).
- `/internal` - Direktori utama untuk kode privat aplikasi:
  - `/admin` - Handler untuk fitur dashboard *admin*.
  - `/app` - Konfigurasi inisialisasi server, koneksi *database*, *routing* (Gin Engine), dan middleware.
  - `/auth` - Handler untuk pendaftaran (*register*) dan *login*.
  - `/middleware` - Lapisan perlindungan (contoh: verifikasi JWT, *cors*).
  - `/models` - Definisi *struct* (Entity) yang berinteraksi langsung dengan database.
  - `/settings` - Handler profil pengguna dan konfigurasi.
- `/pkg` - Paket utilitas umum.

## Persyaratan
- Go versi 1.20+ atau yang lebih baru.
- Konfigurasi variabel *environment*.

## Menjalankan Server (Development)

Pastikan variabel *environment* telah disesuaikan (atau menggunakan default fallback yang ada di dalam kode).

1. Menjalankan langsung melalui Go:
   ```bash
   go run main.go
   ```
2. Menggunakan `air` untuk *Live Reloading* (direkomendasikan):
   ```bash
   air
   ```

Server akan berjalan secara bawaan pada port `3001`.

## Pengujian (Testing)
Jalankan pengujian *unit* dengan perintah:
```bash
go test ./internal/... -v
```
Pengujian menggunakan database SQLite in-memory (`:memory:`) untuk menghindari konflik dengan data *local.db*.
