package services

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

const mockHTML = `
<html>
  <body>
    <div>
      <a href="https://my-cdn.publicgold.com.my/image/catalog/common/liveprice/langkahlangkahmembeligapv2.pdf">1,400,000 = 1 Gram</a>
      <a href="https://my-cdn.publicgold.com.my/image/catalog/common/liveprice/langkahlangkahmembeligapv2.pdf">1,000,000 = 2 Gram</a>
    </div>
    
    <div id="gold_price_col">1 Dinar</div>
    <div>4,000,000</div>
    
    <div id="gold_price_col">10 Gram Goldbar</div>
    <div>13,500,000</div>
    
    <div id="gold_price_col">Silver</div>
    <div>15,000</div>
  </body>
</html>
`

func TestGoldPriceService_FetchGoldPrices(t *testing.T) {
	t.Run("should fetch and parse gold prices from HTML", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(mockHTML))
		}))
		defer server.Close()

		service := NewGoldPriceService()
		service.TargetURL = server.URL
		service.cacheTTL = 0 // bypass cache

		result, err := service.FetchGoldPrices()
		assert.NoError(t, err)
		assert.NotNil(t, result)

		assert.Len(t, result.Poe, 2)
		assert.Equal(t, "1 Gram", result.Poe[0].Label)
		assert.Equal(t, "1,400,000", *result.Poe[0].Price)

		assert.Len(t, result.Dinar, 1)
		assert.Equal(t, "1 Dinar", result.Dinar[0].Label)
		assert.Equal(t, "4,000,000", *result.Dinar[0].Price)

		assert.Len(t, result.Goldbar, 1)
		assert.Equal(t, "10 Gram Goldbar", result.Goldbar[0].Label)
		assert.Equal(t, "13,500,000", *result.Goldbar[0].Price)
	})

	t.Run("should return nil if fetch fails with 404", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
		}))
		defer server.Close()

		service := NewGoldPriceService()
		service.TargetURL = server.URL

		result, err := service.FetchGoldPrices()
		// In go, the original service returns nil, nil for non-200. Let's see...
		assert.NoError(t, err)
		assert.Nil(t, result)
	})

	t.Run("should return error if fetch throws network error", func(t *testing.T) {
		service := NewGoldPriceService()
		service.TargetURL = "http://localhost:0" // invalid port / connection refused

		result, err := service.FetchGoldPrices()
		assert.Error(t, err)
		assert.Nil(t, result)
	})

	t.Run("should return cached data if called within cache TTL", func(t *testing.T) {
		calls := 0
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			calls++
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(mockHTML))
		}))
		defer server.Close()

		service := NewGoldPriceService()
		service.TargetURL = server.URL
		service.cacheTTL = 1 * time.Minute

		// Initial Call
		result1, err := service.FetchGoldPrices()
		assert.NoError(t, err)
		assert.NotNil(t, result1)
		assert.Equal(t, 1, calls)

		// Second call within TTL
		result2, err := service.FetchGoldPrices()
		assert.NoError(t, err)
		assert.Equal(t, result1, result2)
		assert.Equal(t, 1, calls) // Should still be 1
	})
}
