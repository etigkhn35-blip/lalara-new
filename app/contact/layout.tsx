import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Reservations",
  description:
    "Contact La Lara Restaurant & Bar in Yalıkavak, Bodrum for reservations, directions and enquiries. Call, email or book your table via WhatsApp.",
  alternates: {
    canonical: "/contact",
    languages: {
      "en": "/contact",
      "tr": "/tr/iletisim",
      "x-default": "/contact",
    },
  },
  openGraph: {
    url: "/contact",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    title: "Contact & Reservations | La Lara Restaurant & Bar",
    description:
      "Reservations, directions and contact details for La Lara Restaurant & Bar in Yalıkavak, Bodrum.",
    images: ["/images/home/6.jpg"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
