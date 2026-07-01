/**
 * Media slides for the Excellence section tabs.
 * Each tab index maps to slides (videos/images) showcasing that excellence category.
 */

export interface ExcellenceSlide {
  type: "video" | "image";
  src: string;
  label: string;
}

export const TAB_MEDIA: Record<number, ExcellenceSlide[]> = {
  0: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/Hx9sVOrq6WU",
      label: "Video Liputan TV2",
    },
    {
      type: "image",
      src: "https://my-cdn.publicgold.com.my/image/catalog/banner/674d39b1a3e800671364001733114289.jpeg",
      label: "Sertifikat Syariah",
    },
  ],
  1: [
    {
      type: "image",
      src: "https://cdn.visiteliti.com/article/2024-07/25/HM9UDkAptlxWkxBK36gx_1721869162.webp",
      label: "BCA",
    },
    {
      type: "image",
      src: "https://infobanknews.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-06-at-14.19.49-1-1.jpeg",
      label: "BCA",
    },
    {
      type: "image",
      src: "https://asset.kompas.com/crops/ALvckg8qkwVaYTrgXU6ILDSgeuQ=/0x0:780x520/1200x800/data/photo/2025/06/18/6852356cf1adb.jpeg",
      label: "BRI",
    },
    {
      type: "image",
      src: "https://securecms.neraca.co.id/gallery/202201/21377.jpg",
      label: "BNI",
    },
    {
      type: "image",
      src: "https://www.madaninews.id/wp-content/uploads/2024/02/bsi-1-1140x570.jpg",
      label: "BSI",
    },
    {
      type: "image",
      src: "https://awsimages.detik.net.id/visual/2025/04/29/bank-cimb-niaga-1745912369985_169.jpeg?w=900&q=80",
      label: "CIMB",
    },
    {
      type: "image",
      src: "https://cdn.aptoide.com/imgs/a/2/1/a215786f2f2854e9e35e9153e1c10bcf_screen.png",
      label: "Doku",
    },
  ],
  2: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/M_Rdg-VVm1I",
      label: "RPX",
    },
    {
      type: "image",
      src: "https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/article-WSQPRAT-40VYLMD-HAWI2V1-BKJNBTY.webp",
      label: "Paxel",
    },
    {
      type: "image",
      src: "https://foto.kontan.co.id/ULYc1SYKAE_CHGs1FzgckFKLkFM=/smart/filters:format(webp)/2020/08/07/313074817.jpg",
      label: "Anteraja",
    },
  ],
  3: [
    {
      type: "video",
      src: "https://www.youtube.com/embed/V_aAeRL7UB8",
      label: "Jakarta",
    },
    {
      type: "image",
      src: "https://instagram.fupg6-1.fna.fbcdn.net/v/t39.30808-6/506033940_24670834049173343_6287974762171629449_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTA4MHg4MTAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlLmMyIn0&_nc_ht=instagram.fupg6-1.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2gGPf4j7qDOTGW-fQ_GMlDVumT3N8s8MfE1dBZJ0j7ODR4Xy61ptqfe5Iwp4TRXFcaG3Puwlmz3GDEENjPV3FSpA&_nc_ohc=T555t17xi7sQ7kNvwG9xSGs&_nc_gid=6KIEJj6EdmuHKXh4u8HhsQ&edm=AKr904kAAAAA&ccb=7-5&ig_cache_key=MzM5MTI1NDg3NDUzMTI0OTg5Ng%3D%3D.3-ccb7-5&oh=00_AfypobPUD19cB7LuiTU0-MBY6aYmKxt_cG_pnBz3e8eQGA&oe=69CF3692&_nc_sid=23467f",
      label: "Yogyakarta",
    },
    {
      type: "image",
      src: "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepR6E9YxiQJ1pTnW9f98CE0RzZqJRZJbt_hEKoGOFHQBzJI9cMbQM2zPWkaOhhdkkv5rOrauMlTEIKsdFil5B47mBtTxS9TShYD8UXn-qxlRv0p8zxNsc7XUEAPROpt4Ib2l-mV=s1360-w1360-h1020-rw",
      label: "Surabaya",
    },
    {
      type: "image",
      src: "https://assets.promediateknologi.id/crop/0x0:0x0/1200x600/webp/photo/2023/03/17/WhatsApp-Image-2023-03-17-at-082313-1-3343847327.jpeg",
      label: "Bandung",
    },
    {
      type: "image",
      src: "https://balainnews.com/wp-content/uploads/2023/09/IMG-20230909-WA0083.jpg",
      label: "BanjarBaru",
    },
  ],
};
