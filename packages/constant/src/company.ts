/**
 * Media coverage and group company data for Public Gold Indonesia.
 */

export interface MediaItem {
  name: string;
  href: string;
}

export interface GroupCompany {
  name: string;
  href: string;
  logo: string;
}

export const MEDIA_LIST: MediaItem[] = [
  {
    name: "tvOneNews",
    href: "https://www.tvonenews.com/berita/294721-perusahaan-ini-cetak-rekor-penjualan-74-ton-emas-15-juta-pelanggan-di-asia-tenggara",
  },
  {
    name: "TribunNews",
    href: "https://jogja.tribunnews.com/2023/06/14/buka-cabang-kelima-di-yogyakarta-public-gold-indonesia-siap-beri-edukasi-investasi-emas",
  },
  {
    name: "RRI",
    href: "https://rri.co.id/dki-jakarta/bisnis/190451/public-gold-indonesia-hadir-di-bandung-simpan-logam-mulia-lebih-mudah-dan-dekat",
  },
  {
    name: "JPNN",
    href: "https://www.jpnn.com/news/pertama-di-ri-perusahaan-ini-meluncurkan-atm-gold-beli-emas-lebih-mudah-praktis",
  },
];

export const GROUP_LIST: GroupCompany[] = [
  {
    name: "PG Jewel",
    href: "https://pgjewel.my/",
    logo: "https://mypublicgold.com/img/icon/pgjewel.png",
  },
  {
    name: "PG Mall",
    href: "https://pgmall.my/",
    logo: "https://mypublicgold.com/img/icon/pg_mall.png",
  },
  {
    name: "Aurora Italia",
    href: "https://www.auroraitalia.net/",
    logo: "https://mypublicgold.com/img/icon/aurora_italia.png",
  },
];
