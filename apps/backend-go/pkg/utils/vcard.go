package utils

import (
	"fmt"
	"strings"
)

type LeadData struct {
	Nama     string
	Branch   string
	NoTelpon string
}

func EscapeVCardValue(value string) string {
	r := strings.NewReplacer(
		"\\", "\\\\",
		";", "\\;",
		",", "\\,",
		"\n", "\\n",
	)
	return r.Replace(value)
}

func GenerateVCardFile(leads []LeadData) string {
	var sb strings.Builder
	for _, lead := range leads {
		displayName := EscapeVCardValue(fmt.Sprintf("Cust. %s %s", lead.Nama, lead.Branch))
		org := EscapeVCardValue(fmt.Sprintf("Public Gold (%s)", lead.Branch))
		note := EscapeVCardValue(fmt.Sprintf("Pendaftar via Agent Portal - Branch: %s", lead.Branch))

		sb.WriteString("BEGIN:VCARD\r\n")
		sb.WriteString("VERSION:3.0\r\n")
		sb.WriteString(fmt.Sprintf("FN:%s\r\n", displayName))
		sb.WriteString(fmt.Sprintf("N:;%s;;;;\r\n", displayName))
		sb.WriteString(fmt.Sprintf("TEL;TYPE=CELL:%s\r\n", lead.NoTelpon))
		sb.WriteString(fmt.Sprintf("ORG:%s\r\n", org))
		sb.WriteString(fmt.Sprintf("NOTE:%s\r\n", note))
		sb.WriteString("END:VCARD\r\n")
	}
	return sb.String()
}
