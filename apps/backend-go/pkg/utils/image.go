package utils

import (
	"bytes"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/chai2010/webp"
)

type ProcessedImage struct {
	Buffer    []byte
	MimeType  string
	Extension string
}

/**
 * processImage: Porting dari Sharp (NodeJS) ke Go.
 *
 * - Resizes to max 800x800 (preserving aspect ratio)
 * - Converts to WebP format
 * - Quality set to 80 (standard balance)
 */
func ProcessImage(file io.Reader, filename string, contentType string) (*ProcessedImage, error) {
	// 1. Jika sudah WebP, langsung kembalikan
	if contentType == "image/webp" || strings.HasSuffix(strings.ToLower(filename), ".webp") {
		buf := new(bytes.Buffer)
		if _, err := io.Copy(buf, file); err != nil {
			return nil, err
		}
		return &ProcessedImage{
			Buffer:    buf.Bytes(),
			MimeType:  "image/webp",
			Extension: "webp",
		}, nil
	}

	// 2. Decode image
	src, _, err := image.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %v", err)
	}

	// 3. Resize (Fit inside 800x800, maintain aspect ratio)
	// Sharp's "inside" is equivalent to imaging.Fit
	dst := imaging.Fit(src, 800, 800, imaging.Lanczos)

	// 4. Encode to WebP
	// Note: Standard Go library only has WebP decoder. 
	// For Encoder, we usually use "github.com/chai2010/webp"
	var buf bytes.Buffer
	err = webp.Encode(&buf, dst, &webp.Options{Lossless: false, Quality: 80})
	if err != nil {
		return nil, fmt.Errorf("failed to encode webp: %v", err)
	}

	return &ProcessedImage{
		Buffer:    buf.Bytes(),
		MimeType:  "image/webp",
		Extension: "webp",
	}, nil
}
