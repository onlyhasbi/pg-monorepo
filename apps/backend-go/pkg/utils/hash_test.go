package utils_test

import (
	"testing"

	"github.com/onlyhasbi/pg-monorepo/backend-go/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestHashAndVerifyPassword(t *testing.T) {
	password := "mypassword123"

	// Hash password
	hash, err := utils.HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hash)

	// Verify correct password
	match, err := utils.VerifyPassword(password, hash)
	assert.NoError(t, err)
	assert.True(t, match)

	// Verify wrong password
	match, err = utils.VerifyPassword("wrongpassword", hash)
	assert.NoError(t, err)
	assert.False(t, match)
}

func TestVerifyPassword_InvalidFormat(t *testing.T) {
	match, err := utils.VerifyPassword("mypassword", "invalid-hash-format")
	assert.Error(t, err)
	assert.False(t, match)
}
