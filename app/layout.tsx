import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://lalara.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "La Lara Restaurant & Bar | Yalıkavak, Bodrum",
    template: "%s | La Lara Restaurant & Bar",
  },
  description:
    "La Lara Restaurant & Bar in Yalıkavak, Bodrum. Mediterranean flavours, panoramic Yalıkavak Bay views, cocktails, breakfast and evenings made for sharing.",
  applicationName: "La Lara Restaurant & Bar",
  authors: [{ name: "La Lara Restaurant & Bar" }],
  creator: "La Lara Restaurant & Bar",
  publisher: "La Lara Restaurant & Bar",
  category: "Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/pink-elephant.ico",
    shortcut: "/pink-elephant.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    url: siteUrl,
    siteName: "La Lara Restaurant & Bar",
    title: "La Lara Restaurant & Bar | Yalıkavak, Bodrum",
    description:
      "Mediterranean flavours, panoramic Yalıkavak Bay views and memorable evenings in Yalıkavak, Bodrum.",
    images: [
      {
        url: "/images/home/1.jpg",
        width: 1200,
        height: 630,
        alt: "La Lara Restaurant & Bar in Yalıkavak, Bodrum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Lara Restaurant & Bar | Yalıkavak, Bodrum",
    description:
      "Mediterranean flavours, panoramic Yalıkavak Bay views and memorable evenings in Yalıkavak, Bodrum.",
    images: ["/images/home/1.jpg"],
  },
};

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${siteUrl}/#restaurant`,
  name: "La Lara Restaurant & Bar",
  url: siteUrl,
  image: [
    `${siteUrl}/images/home/1.jpg`,
    `${siteUrl}/images/home/3.jpg`,
    `${siteUrl}/images/home/6.jpg`,
  ],
  logo: `${siteUrl}/lalara-logo.png`,
  telephone: "+90 545 894 18 38",
  email: "reservation.bodrum@lalara.com.tr",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Geriş Mah., 2026. Sokak No:5",
    addressLocality: "Yalıkavak",
    addressRegion: "Muğla",
    postalCode: "48990",
    addressCountry: "TR",
  },
  servesCuisine: ["Mediterranean", "Turkish", "Seafood"],
  hasMenu: [
    `${siteUrl}/lalara-menu.pdf`,
    `${siteUrl}/lalara-drinks.pdf`,
    `${siteUrl}/lalara-breakfast.pdf`,
  ],
  sameAs: [
    "https://www.instagram.com/lalara.bodrum/",
    "https://www.facebook.com/lalararestaurant",
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "La Lara Restaurant & Bar",
  inLanguage: ["en", "tr"],
  publisher: {
    "@id": `${siteUrl}/#restaurant`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
