package services

import (
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/onlyhasbi/pg-monorepo/backend-go/internal/models"
)

const publicGoldURL = "https://publicgold.co.id/"

type GoldPriceService struct {
	cache     *models.GoldPricesResult
	cacheTime time.Time
	cacheTTL  time.Duration
	mu        sync.RWMutex
}

func NewGoldPriceService() *GoldPriceService {
	return &GoldPriceService{
		cacheTTL: 2 * time.Minute,
	}
}

func (s *GoldPriceService) FetchGoldPrices() (*models.GoldPricesResult, error) {
	// 1. Check Cache
	s.mu.RLock()
	if s.cache != nil && time.Since(s.cacheTime) < s.cacheTTL {
		defer s.mu.RUnlock()
		return s.cache, nil
	}
	s.mu.RUnlock()

	// 2. Scraping Logic
	s.mu.Lock()
	defer s.mu.Unlock()

	// Double check cache after lock
	if s.cache != nil && time.Since(s.cacheTime) < s.cacheTTL {
		return s.cache, nil
	}

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", publicGoldURL, nil)
	if err != nil {
		return nil, err
	}

	// Mimic original headers
	req.Header.Set("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36")
	req.Header.Set("Accept-Language", "id-ID,id;q=0.9")
	req.Header.Set("Cookie", "language=id; currency=IDR;")

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		log.Printf("Error fetching gold price: status code %d", res.StatusCode)
		return nil, nil
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}

	result := &models.GoldPricesResult{
		Poe:     []models.GoldPrice{},
		Dinar:   []models.GoldPrice{},
		Goldbar: []models.GoldPrice{},
	}

	// 1. Scraping POE Prices
	doc.Find("a[href='https://my-cdn.publicgold.com.my/image/catalog/common/liveprice/langkahlangkahmembeligapv2.pdf']").Each(func(i int, sel *goquery.Selection) {
		text := strings.TrimSpace(sel.Text())
		if strings.Contains(text, "=") {
			parts := strings.Split(text, "=")
			if len(parts) == 2 {
				price := strings.TrimSpace(parts[0])
				label := strings.TrimSpace(parts[1])
				result.Poe = append(result.Poe, models.GoldPrice{
					Label: label,
					Price: &price,
				})
			}
		}
	})

	// 2. Scraping Unit Prices
	doc.Find("#gold_price_col").Each(func(i int, sel *goquery.Selection) {
		label := strings.TrimSpace(sel.Text())
		priceSel := sel.Next()
		price := strings.TrimSpace(priceSel.Text())
		
		if label != "" {
			gp := models.GoldPrice{Label: label}
			if price != "" {
				gp.Price = &price
			}
			
			if strings.Contains(label, "Dinar") || strings.Contains(label, "Dirham") {
				result.Dinar = append(result.Dinar, gp)
			} else if strings.Contains(strings.ToLower(label), "gram") {
				result.Goldbar = append(result.Goldbar, gp)
			}
		}
	})

	// Update Cache
	s.cache = result
	s.cacheTime = time.Now()

	return result, nil
}
