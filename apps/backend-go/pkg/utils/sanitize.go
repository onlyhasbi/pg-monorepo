package utils

import (
	"fmt"
	"regexp"
	"strings"
)

func SanitizePGCode(pgcode string) string {
	reg := regexp.MustCompile(`[^a-zA-Z0-9_\-]`)
	return strings.TrimSpace(reg.ReplaceAllString(pgcode, ""))
}

func SanitizePageId(pageid string) string {
	reg := regexp.MustCompile(`[^a-z0-9_\-]`)
	return strings.TrimSpace(reg.ReplaceAllString(strings.ToLower(pageid), ""))
}

func SanitizeString(input string) string {
	input = regexp.MustCompile(`[<> ]`).ReplaceAllString(input, "")
	input = regexp.MustCompile(`(?i)javascript:`).ReplaceAllString(input, "")
	input = regexp.MustCompile(`(?i)on\w+\s*=`).ReplaceAllString(input, "")
	return strings.TrimSpace(input)
}

func EscapeFts(query string) string {
	reg := regexp.MustCompile(`[^a-zA-Z0-9\s]`)
	cleaned := strings.TrimSpace(reg.ReplaceAllString(query, ""))
	if cleaned == "" {
		return ""
	}
	words := strings.Fields(cleaned)
	for i, word := range words {
		words[i] = fmt.Sprintf("\"%s\"", word)
	}
	return strings.Join(words, " AND ")
}

func IsValidEmail(email string) bool {
	reg := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	return reg.MatchString(email)
}
