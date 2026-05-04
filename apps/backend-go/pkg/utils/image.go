package utils

import (
	"bytes"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	_ "image/gif"
	_ "image/png"
	"io"
	"strings"

	"github.com/disintegration/imaging"
)

type ProcessedImage struct {
	Buffer    []byte
	MimeType  string
	Extension string
}

/**
 * ProcessImage: Optimasi gambar sebelum diupload ke Cloudinary.
 * 
 * Fungsi ini melakukan resize ke max 800x800 dan memilih encoder yang tepat:
 * - PNG/GIF -> Diencode ke PNG untuk mempertahankan transparansi.
 * - Lainnya -> Diencode ke JPEG untuk efisiensi ukuran file.
 */
func ProcessImage(file io.Reader, filename string, contentType string) (*ProcessedImage, error) {
	// 1. Decode image (Mendukung PNG, JPEG, GIF)
	src, format, err := image.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %v", err)
	}

	// 2. Resize (Fit inside 800x800, maintain aspect ratio)
	dst := imaging.Fit(src, 800, 800, imaging.Lanczos)

	var buf bytes.Buffer
	var mimeType string
	var extension string

	// 3. Conditional Encoding
	// Jika PNG atau GIF, kita gunakan PNG untuk mempertahankan transparansi
	if format == "png" || format == "gif" {
		err = png.Encode(&buf, dst)
		mimeType = "image/png"
		extension = "png"
	} else {
		// Default ke JPEG untuk foto/gambar biasa agar ukuran file kecil
		err = jpeg.Encode(&buf, dst, &jpeg.Options{Quality: 80})
		mimeType = "image/jpeg"
		extension = "jpg"
	}

	if err != nil {
		return nil, fmt.Errorf("failed to encode image: %v", err)
	}

	return &ProcessedImage{
		Buffer:    buf.Bytes(),
		MimeType:  mimeType,
		Extension: extension,
	}, nil
}

/**
 * GetOptimizedURL: Mengubah URL standard Cloudinary menjadi URL yang teroptimasi.
 * Menambahkan parameter:
 * - f_auto: Format otomatis (WebP/AVIF tergantung browser)
 * - q_auto: Kualitas otomatis (kompresi terbaik tanpa merusak visual)
 */
func GetOptimizedURL(url string) string {
	if url == "" || !strings.Contains(url, "cloudinary.com") {
		return url
	}
	// Menyisipkan f_auto,q_auto setelah '/upload/' di URL Cloudinary
	return strings.Replace(url, "/upload/", "/upload/f_auto,q_auto/", 1)
}
