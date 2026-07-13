/**
 * Gold product catalog data — dinar and goldbar definitions.
 * Moved from packages/ui/src/pricelist.tsx for centralized access.
 */

export interface ProductItem {
  title: string;
  weight: string;
  url: string;
  category?: string;
}

export const PRINTING_COSTS: Record<string, number> = {
  // Goldbar
  "0.5g": 52500,
  "1g": 52500,
  "5g": 30000,
  "10g": 45000,
  "20g": 70000,
  "50g": 120000,
  "100g": 210000,
  // Dinar
  "1.0625g": 70000,
  "2.125g": 30000,
  "4.25g": 30000,
  "21.25g": 70000,
  "42.5g": 120000,
};

export interface PrintingCostRow {
  label: string;
  weight: string;
  cost: number;
}

export const GOLDBAR_COST_TABLE: PrintingCostRow[] = [
  { label: "0.5g", weight: "0.5g", cost: PRINTING_COSTS["0.5g"]! },
  { label: "1g", weight: "1g", cost: PRINTING_COSTS["1g"]! },
  { label: "5g", weight: "5g", cost: PRINTING_COSTS["5g"]! },
  { label: "10g", weight: "10g", cost: PRINTING_COSTS["10g"]! },
  { label: "20g", weight: "20g", cost: PRINTING_COSTS["20g"]! },
  { label: "50g", weight: "50g", cost: PRINTING_COSTS["50g"]! },
  { label: "100g", weight: "100g", cost: PRINTING_COSTS["100g"]! },
];

export const DINAR_COST_TABLE: PrintingCostRow[] = [
  {
    label: "¼ Dinar (1.0625g)",
    weight: "1.0625g",
    cost: PRINTING_COSTS["1.0625g"]!,
  },
  {
    label: "½ Dinar (2.125g)",
    weight: "2.125g",
    cost: PRINTING_COSTS["2.125g"]!,
  },
  { label: "1 Dinar (4.25g)", weight: "4.25g", cost: PRINTING_COSTS["4.25g"]! },
  {
    label: "5 Dinar (21.25g)",
    weight: "21.25g",
    cost: PRINTING_COSTS["21.25g"]!,
  },
  { label: "10 Dinar (42.5g)", weight: "42.5g", cost: PRINTING_COSTS["42.5g"]! },
];

export const dinar: ProductItem[] = [
  {
    title: "1/4 Dinar - Mekah",
    weight: "1.0625g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0001B.png",
    category: "dinar",
  },
  {
    title: "1/4 Dinar - Masjid Istiqlal",
    weight: "1.0625g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0001BB_1741330037.png",
    category: "dinar",
  },
  {
    title: "1/4 Dinar - Raya 2026",
    weight: "1.0625g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0001BC_1770285287.png",
    category: "dinar",
  },
  {
    title: "1/2 Dinar",
    weight: "2.125g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0001A.png",
    category: "dinar",
  },
  {
    title: "1 Dinar",
    weight: "4.25g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0001.png",
    category: "dinar",
  },
  {
    title: "5 Dinar",
    weight: "21.25g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0005.png",
    category: "dinar",
  },
  {
    title: "10 Dinar",
    weight: "42.5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PDI0010.png",
    category: "dinar",
  },
];

export const goldbar: ProductItem[] = [
  {
    title: "0.5 gram - Thank You",
    weight: "0.5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001CZ_1692589929.png",
    category: "goldbar",
  },
  {
    title: "0.5 gram - Birthday",
    weight: "0.5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NI_1741330059.png",
    category: "goldbar",
  },
  {
    title: "0.5 gram - Batik Megamendung",
    weight: "0.5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NJ_1750906442.png",
    category: "goldbar",
  },
  {
    title: "0.5 gram - Batik Lontara",
    weight: "0.5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NL_1756438125.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Batik Toraja",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NA.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Batik Krakatau",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NB.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Batik Sentani",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NC.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Batik Pekalongan",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001ND.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Batik Enggang",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NE.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Cenderawasih Merah",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NF.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Raya 2025",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NG_1742458634.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Merdeka",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NK_1753243761.png",
    category: "goldbar",
  },
  {
    title: "1 gram - Sultan Hasanuddin",
    weight: "1g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PP0001NM_1756437982.png",
    category: "goldbar",
  },
  {
    title: "5 gram",
    weight: "5g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PGI0005.png",
    category: "goldbar",
  },
  {
    title: "10 gram",
    weight: "10g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PGI0010.png",
    category: "goldbar",
  },
  {
    title: "20 gram",
    weight: "20g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PGI0020.png",
    category: "goldbar",
  },
  {
    title: "50 gram",
    weight: "50g",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PGI0050.png",
    category: "goldbar",
  },
  {
    title: "100 gram",
    url: "https://my-cdn.publicgold.com.my/image/catalog/product/PGI0100.png",
    weight: "100g",
    category: "goldbar",
  },
];
