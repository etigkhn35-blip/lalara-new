import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Lara Restaurant & Bar | Yalıkavak, Bodrum",
  description:
    "La Lara Restaurant & Bar Yalıkavak, Bodrum'da Akdeniz lezzetleri, Yalıkavak Körfezi manzarası, kokteyller, kahvaltı ve paylaşmaya değer sofralar sunar.",
  alternates: {
    canonical: "/tr",
    languages: {
      "en": "/",
      "tr": "/tr",
      "x-default": "/",
    },
  },
  openGraph: {
    url: "/tr",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    title: "La Lara Restaurant & Bar | Yalıkavak, Bodrum",
    description:
      "Akdeniz lezzetleri, Yalıkavak Körfezi manzarası ve paylaşmaya değer sofralar La Lara'da.",
    images: ["/images/home/1.jpg"],
  },
};

export default function TurkishLayout({ children }: { children: React.ReactNode }) {
  return children;
}
