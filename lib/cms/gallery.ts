import type { CmsMap } from "./types";

export const galleryOriginals: Record<"en" | "tr", CmsMap> = {
  en: {
    "gallery-hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Moments\nat La Lara",
      body: "From quiet mornings to sunset dinners and evenings overlooking Yalıkavak Bay.",
      visible: true,
    },
    "gallery-cta": {
      eyebrow: "Your Table Awaits",
      heading: "Experience La Lara\nfor yourself.",
      buttonLabel: "REQUEST A RESERVATION",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20request%20a%20reservation.%0A%0ADate%3A%0ATime%3A%0ANumber%20of%20guests%3A",
      visible: true,
    },
  },
  tr: {
    "gallery-hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "La Lara'dan\nAnlar",
      body: "Sakin sabahlardan gün batımı sofralarına ve Yalıkavak Körfezi'ne karşı uzayan akşamlara.",
      visible: true,
    },
    "gallery-cta": {
      eyebrow: "Masanız Sizi Bekliyor",
      heading: "La Lara'yı\ndeneyimleyin.",
      buttonLabel: "REZERVASYON TALEBİ",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20rezervasyon%20talebinde%20bulunmak%20istiyorum.%0A%0ATarih%3A%0ASaat%3A%0AKi%C5%9Fi%20say%C4%B1s%C4%B1%3A",
      visible: true,
    },
  },
};
