import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim & Rezervasyon",
  description:
    "La Lara Restaurant & Bar Yalıkavak, Bodrum iletişim, rezervasyon ve yol tarifi bilgileri. Telefon, e-posta veya WhatsApp üzerinden masanızı ayırtın.",
  alternates: {
    canonical: "/tr/iletisim",
    languages: {
      "en": "/contact",
      "tr": "/tr/iletisim",
      "x-default": "/contact",
    },
  },
  openGraph: {
    url: "/tr/iletisim",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    title: "İletişim & Rezervasyon | La Lara Restaurant & Bar",
    description:
      "La Lara Restaurant & Bar Yalıkavak için rezervasyon, iletişim ve yol tarifi bilgileri.",
    images: ["/images/home/6.jpg"],
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
