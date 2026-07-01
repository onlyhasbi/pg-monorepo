# Panduan Workflow AI (AI Common Flow)

Berikut adalah urutan kerja wajib (SOP) yang harus diikuti oleh agen AI saat mengerjakan tugas (task) di dalam repositori ini:

## 1. Analisis dan Pemahaman (Discovery & Planning)
- **Pemetaan Konteks:** Cari tahu apa yang diminta user. Tentukan ruang lingkupnya (frontend, backend, database, dsb.).
- **Pencarian Kode:** Gunakan fitur pencarian teks/kode (grep, search tools) atau perintah shell untuk melacak letak fungsi/komponen. **Jangan pernah berasumsi atau bekerja berdasarkan ingatan.**
- **Buka & Baca:** Baca source code secara mendetail menggunakan alat baca file yang tersedia sebelum melakukan edit.
- **Perencanaan (Jika kompleks):** Jika tugas berskala besar atau mengubah arsitektur, siapkan dokumen *implementation plan* dan minta user me-review serta memberikan persetujuan sebelum eksekusi dimulai.

## 2. Eksekusi Implementasi (Execution)
- **Edit Spesifik:** Gunakan fitur penggantian konten file (replace) untuk melakukan modifikasi baris kode secara presisi. Jangan menimpa seluruh file panjang (>200 baris) jika hanya mengubah satu fungsi.
- **Aturan Penulisan:** Patuhi *pattern* kode lokal. "When in Rome, do as the Romans do."
  - **TypeScript:** Dilarang menggunakan `any`. Perhatikan strict typing.
  - **Go:** Ikuti konvensi standar Go (penggunaan pointer, struct, error handling, dsb.).
- **Pembersihan:** Jangan tinggalkan kode debugging (`console.log`, `fmt.Println` sisa) setelah tugas selesai. Hapus juga import yang tidak digunakan (contoh: jalankan linter seperti `biome check --write --unsafe` jika relevan).

## 3. Verifikasi (Testing & Validation)
- **Incremental Testing:** Setelah setiap perubahan logis (misalnya satu fungsi selesai diubah), langsung jalankan linter atau kompilator (`go test`, `tsc`, `biome check`, dsb.). Jangan menunda pengujian hingga semua selesai.
- **Pembuktian:** AI harus membuktikan kode tidak error (bisa dikompilasi atau lolos pengujian).
- **No Silent Failures:** Setiap penanganan error harus terlihat—baik melalui log yang jelas atau return error yang tidak ditelan begitu saja. (Contoh: jangan hanya `return nil, err` tanpa mencatat konteks jika error itu kritis.)

## 4. Komunikasi Laporan (Reporting)
- Lapor dengan bahasa yang singkat, jelas, dan profesional (tanpa banyak filler).
- Sebutkan file apa saja yang diubah dan alasan perubahannya.
- Untuk tindakan berisiko yang memerlukan izin user (seperti `rm -rf`, mengubah konfigurasi database, penghapusan data, dsb.), AI **wajib meminta izin terlebih dahulu** sebelum menjalankannya.
