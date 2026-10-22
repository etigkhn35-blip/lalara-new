import type { CmsLocale, CmsMap } from "./types";

export const HOMEPAGE_SECTION_KEYS = [
  "hero",
  "menus",
  "homepage-food-card",
  "homepage-drinks-card",
  "homepage-breakfast-card",
  "homepage-our-story",
  "homepage-story-detail",
  "experience-gallery",
  "homepage-private-events",
  "reservation-contact",
] as const;

const en: CmsMap = {
  hero: {
    heading: "Mediterranean Dining\nAbove Yalıkavak Bay.",
    body: "Mediterranean food, beautiful views and warm hospitality in Yalıkavak.",
    buttonLabel: "Reserve a Table",
    buttonLink: "#reserve",
    visible: true,
  },
  menus: { eyebrow: "The Menus", heading: "Mediterranean\nFood & Drinks", visible: true },
  "homepage-food-card": { heading: "Food", buttonLabel: "VIEW MENU", buttonLink: "/food-menu?lang=en", visible: true },
  "homepage-drinks-card": { heading: "Drinks", buttonLabel: "VIEW MENU", buttonLink: "/drinks-menu?lang=en", visible: true },
  "homepage-breakfast-card": { heading: "Breakfast", buttonLabel: "VIEW MENU", buttonLink: "/breakfast-menu?lang=en", visible: true },
  "homepage-our-story": {
    eyebrow: "Our Story",
    heading: "A Family Story,\nA Shared Table.",
    body: "Long before La Lara became a restaurant, there was a table where everyone felt at home.\n\nIt belonged to our grandmother, Lara — a career woman with a big personality, a love of bringing people together and, admittedly, a little bit of diva spirit.\n\nHer kitchen was a place for long conversations, laughter, stories and food meant to be shared. That feeling became the inspiration behind La Lara.",
    buttonLabel: "READ OUR STORY",
    buttonLink: "/our-story",
    visible: true,
  },
  "homepage-story-detail": { eyebrow: "The story behind La Lara", heading: "The story behind\nLa Lara.", visible: true },
  "experience-gallery": {
    eyebrow: "La Lara in Yalıkavak",
    heading: "From the table\nto the view.",
    body: "Mediterranean food,\ncocktails and evenings\noverlooking Yalıkavak Bay.",
    buttonLabel: "VIEW GALLERY",
    buttonLink: "/gallery",
    visible: true,
  },
  "homepage-private-events": {
    eyebrow: "Private Events",
    heading: "Private Dining\n& Events",
    body: "Weddings, celebrations, private dinners and gatherings overlooking Yalıkavak Bay.\n\nTell us what you are planning and our team will help shape the occasion around your guests.",
    buttonLabel: "PLAN YOUR EVENT",
    buttonLink: "/private-events",
    visible: true,
  },
  "reservation-contact": {
    eyebrow: "Yalıkavak · Bodrum",
    heading: "Reserve\nYour Table",
    body: "Request your table by WhatsApp, phone or email.\nOur team will confirm availability with you.",
    buttonLabel: "REQUEST VIA WHATSAPP",
    visible: true,
  },
};

const tr: CmsMap = {
  hero: {
    heading: "Yalıkavak Körfezi'ne Karşı\nAkdeniz Mutfağı.",
    body: "Aile hikâyesinden ilham alan La Lara; Akdeniz lezzetlerini, güzel manzaraları ve sıcak misafirperverliği bir araya getiriyor.",
    buttonLabel: "REZERVASYON YAP",
    buttonLink: "#reserve",
    visible: true,
  },
  menus: { eyebrow: "Menüler", heading: "Menülerimizi\nKeşfedin", visible: true },
  "homepage-food-card": { eyebrow: "Akdeniz", heading: "Yemek", buttonLabel: "MENÜYÜ GÖR", buttonLink: "/food-menu?lang=tr", visible: true },
  "homepage-drinks-card": { eyebrow: "Bar", heading: "İçecek", buttonLabel: "MENÜYÜ GÖR", buttonLink: "/drinks-menu?lang=tr", visible: true },
  "homepage-breakfast-card": { eyebrow: "Sabah", heading: "Kahvaltı", buttonLabel: "MENÜYÜ GÖR", buttonLink: "/breakfast-menu?lang=tr", visible: true },
  "homepage-our-story": {
    eyebrow: "Hikâyemiz",
    heading: "Bir Aile Hikâyesi,\nPaylaşılan Bir Sofra.",
    body: "La Lara bir restoran olmadan çok önce, herkesin kendini evinde hissettiği bir sofra vardı.\n\nBu sofra büyükannemiz Lara'ya aitti. Sıcak, karakterli ve biraz da diva ruhuna sahip bir kadındı. Yemeğe, ailesine ve insanları bir araya getirmeye duyduğu sevgi, La Lara'da yaratmak istediğimiz her şeyin ilhamı oldu.\n\nBazı hikâyeler anlatılmadan bırakılamayacak kadar özeldir.",
    buttonLabel: "HİKÂYEMİZİ KEŞFEDİN",
    buttonLink: "/tr/hikayemiz",
    visible: true,
  },
  "homepage-story-detail": { eyebrow: "La Lara'nın Hikâyesi", heading: "İsmin Ardındaki\nKadın.", visible: true },
  "experience-gallery": {
    eyebrow: "Yalıkavak'ta La Lara",
    heading: "Sofradan\nManzaraya.",
    body: "Akdeniz mutfağı, kokteyller ve Yalıkavak Körfezi'ne karşı akşamlar.",
    buttonLabel: "GALERİYİ GÖR",
    buttonLink: "/tr/galeri",
    visible: true,
  },
  "homepage-private-events": {
    eyebrow: "Özel Davetler",
    heading: "Özel Yemekler\n& Etkinlikler",
    body: "Yalıkavak Körfezi'ne karşı düğünler, doğum günleri, özel yemekler ve davetler.\n\nNasıl bir etkinlik planladığınızı bize anlatın; ekibimiz davetinizi size ve misafirlerinize göre şekillendirsin.",
    buttonLabel: "ETKİNLİĞİNİZİ PLANLAYIN",
    buttonLink: "/tr/ozel-etkinlikler",
    visible: true,
  },
  "reservation-contact": {
    eyebrow: "Yalıkavak · Bodrum",
    heading: "Masanızı\nAyırtın",
    body: "WhatsApp, telefon veya e-posta üzerinden rezervasyon talebinizi iletin.\nEkibimiz uygunluğu sizinle teyit edecektir.",
    buttonLabel: "WHATSAPP İLE TALEP GÖNDER",
    visible: true,
  },
};

export const homepageOriginals: Record<CmsLocale, CmsMap> = { en, tr };
