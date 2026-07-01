# Public Gold - Agent Portal (Monorepo)

Repositori ini adalah sebuah monorepo yang berisi Frontend (React/Vite/TanStack) dan Backend (Go + Gin).

## Struktur Repositori

Proyek ini dibagi ke dalam folder `apps/` dan `packages/`:

### Apps
- `apps/landing` - Frontend landing page (Vite + React)
- `apps/admin-pgbo` - Frontend portal dealer/agent (Vite + React)
- `apps/super-admin` - Frontend untuk super admin (Vite + React)
- `apps/backend-go` - Backend API yang ditulis menggunakan Golang (Gin Framework)

### Packages (Shared)
- `packages/ui` - Komponen UI bersama (shadcn/ui + Tailwind)
- `packages/lib` - Utilitas bersama, konfigurasi, dan setup Cloudinary
- `packages/types` - Definisi Tipe dan Interface global
- `packages/services` - Kumpulan fungsi API client dan fetch wrappers

## Menjalankan Aplikasi Secara Lokal (Development)

Proyek ini menggunakan **Bun** sebagai *package manager*.

1. **Install Dependencies:**
   Jalankan dari direktori *root*:
   ```bash
   bun install
   ```

2. **Menjalankan Frontend:**
   Anda dapat menjalankan semua frontend secara bersamaan menggunakan skrip *dev*:
   ```bash
   bun run dev
   ```
   Atau untuk menjalankan salah satu saja, masuk ke dalam foldernya (misal `apps/admin-pgbo`) lalu jalankan `bun dev`.

3. **Menjalankan Backend (Go):**
   Masuk ke folder `apps/backend-go` dan gunakan `air` untuk *live-reloading* atau jalankan *main file*:
   ```bash
   cd apps/backend-go
   go run main.go
   ```
   Backend Go akan berjalan di `http://localhost:3001`.

## AI Workflow (Panduan Agen AI)

Bagi AI *Assistant* yang berkontribusi pada repositori ini, pastikan membaca panduan alur kerja wajib yang tertera di:
- [`.agents/AGENTS.md`](./.agents/AGENTS.md)

Poin-poin utama:
- Jangan melakukan perubahan destruktif tanpa *plan* dan persetujuan *user*.
- Gunakan `replace_file_content` untuk *targeted edits*.
- Jalankan *testing* (`go test`, `biome check --write --unsafe`) setiap selesai merubah logika secara bertahap.
- Dilarang menelan error (silencing error) pada *backend* Go maupun frontend TypeScript.
