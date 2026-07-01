package utils_test

import (
	"testing"

	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestSanitizePGCode(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{"normal", "PG012345", "PG012345"},
		{"lowercase", "pg012345", "pg012345"},
		{"with spaces", " PG012345 ", "PG012345"},
		{"special chars", "PG-012345!", "PG-012345"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := utils.SanitizePGCode(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSanitizePageId(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{"normal", "my-page-123", "my-page-123"},
		{"uppercase", "My-Page-123", "my-page-123"},
		{"with spaces", " my page ", "mypage"},
		{"special chars", "my@page!#", "mypage"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := utils.SanitizePageId(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}
