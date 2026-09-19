import type { MetadataRoute } from "next";

const siteUrl = "https://lalara.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          tr: `${siteUrl}/tr`,
        },
      },
    },
    {
      url: `${siteUrl}/tr`,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteUrl}/`,
          tr: `${siteUrl}/tr`,
        },
      },
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/contact`,
          tr: `${siteUrl}/tr/iletisim`,
        },
      },
    },
    {
      url: `${siteUrl}/tr/iletisim`,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/contact`,
          tr: `${siteUrl}/tr/iletisim`,
        },
      },
    },
  ];
}
