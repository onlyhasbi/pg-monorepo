package models

type GoldPrice struct {
	Label string  `json:"label"`
	Price *string `json:"price"`
}

type GoldPricesResult struct {
	Poe     []GoldPrice `json:"poe"`
	Dinar   []GoldPrice `json:"dinar"`
	Goldbar []GoldPrice `json:"goldbar"`
}
