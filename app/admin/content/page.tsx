"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";

type Language = "EN" | "TR";

type PageType =
  | "Navigation"
  | "Homepage"
  | "Our Story"
  | "Gallery"
  | "Private Events"
  | "Contact"
  | "Footer"
  | "Unmapped";

type FormData = {
  eyebrow: string;
  heading: string;
  body: string;
  buttonLabel: string;
  buttonLink: string;

  eyebrowSize: number;
  headingSize: number;
  textSize: number;
  buttonSize: number;

  // Legacy shared typography — old Firestore records keep working.
  fontFamily: "display" | "sans";
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;

  // Each visible text role is independently editable.
  eyebrowFontFamily: "display" | "sans";
  headingFontFamily: "display" | "sans";
  textFontFamily: "display" | "sans";
  buttonFontFamily: "display" | "sans";

  eyebrowFontWeight: number;
  headingFontWeight: number;
  textFontWeight: number;
  buttonFontWeight: number;

  eyebrowLineHeight: number;
  headingLineHeight: number;
  textLineHeight: number;
  buttonLineHeight: number;

  eyebrowLetterSpacing: number;
  headingLetterSpacing: number;
  textLetterSpacing: number;
  buttonLetterSpacing: number;

  visible: boolean;
};

const TYPOGRAPHY_FIELDS = [
  "eyebrowSize",
  "headingSize",
  "textSize",
  "buttonSize",
  "eyebrowFontFamily",
  "headingFontFamily",
  "textFontFamily",
  "buttonFontFamily",
  "eyebrowFontWeight",
  "headingFontWeight",
  "textFontWeight",
  "buttonFontWeight",
  "eyebrowLineHeight",
  "headingLineHeight",
  "textLineHeight",
  "buttonLineHeight",
  "eyebrowLetterSpacing",
  "headingLetterSpacing",
  "textLetterSpacing",
  "buttonLetterSpacing",
] as const;

type TypographyField = (typeof TYPOGRAPHY_FIELDS)[number];

function isTypographyField(
  key: keyof FormData
): key is TypographyField {
  return (TYPOGRAPHY_FIELDS as readonly string[]).includes(key);
}

const pageSections: Record<PageType, string[]> = {
  Navigation: [
    "Nav Menu",
    "Nav Our Story",
    "Nav Gallery",
    "Nav Private Events",
    "Nav Contact",
    "Nav Book a Table",
  ],

  Homepage: [
    "Hero",
    "Menus",
    "Homepage Food Card",
    "Homepage Drinks Card",
    "Homepage Breakfast Card",
    "Homepage Our Story",
    "Homepage Story Detail",
    "Experience Gallery",
    "Homepage Private Events",
    "Reservation Contact",
  ],

  "Our Story": [
    "Story Hero",
    "Story Woman Intro",
    "Story Lara Detail",
    "Story Quote",
    "Story Place",
    "Pink Elephant",
    "The People Behind Our Story",
    "Story CTA",
  ],

   Gallery: [
    "Gallery Hero",
    "Gallery CTA",
  ],

   "Private Events": [
    "Private Events Hero",
    "Private Events Intro",
    "Private Events Lounge",
    "Private Events Restaurant",
    "Private Events Weddings",
    "Private Events CTA",
  ],

  Contact: [
    "Contact Hero",
    "Contact Information",
    "Reservations",
    "Social",
    "Contact Map",
    "Reservation CTA",
  ],

  Footer: [
    "Footer Brand",
    "Footer Address",
    "Footer Navigation",
    "Footer Social",
    "Footer Bottom",
  ],

  Unmapped: [],
};

const blank: FormData = {
  eyebrow: "",
  heading: "",
  body: "",
  buttonLabel: "",
  buttonLink: "",

  eyebrowSize: 13,
  headingSize: 48,
  textSize: 17,
  buttonSize: 14,

  fontFamily: "display",
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: 0,

  eyebrowFontFamily: "sans",
  headingFontFamily: "display",
  textFontFamily: "sans",
  buttonFontFamily: "sans",

  eyebrowFontWeight: 500,
  headingFontWeight: 400,
  textFontWeight: 400,
  buttonFontWeight: 500,

  eyebrowLineHeight: 1.2,
  headingLineHeight: 1.08,
  textLineHeight: 1.65,
  buttonLineHeight: 1.2,

  eyebrowLetterSpacing: 1.4,
  headingLetterSpacing: 0,
  textLetterSpacing: 0,
  buttonLetterSpacing: 0.8,

  visible: true,
};

const defaults: Record<
  Language,
  Record<string, Partial<FormData>>
> = {
  EN: {
    /* =====================================================
       NAVIGATION
       ===================================================== */

    "Nav Menu": {
      heading: "MENU",
      buttonLink: "/#menus",
      fontFamily: "sans",
      headingSize: 15,
    },
"Nav Our Story": {
      heading: "OUR STORY",
      buttonLink: "/our-story",
      fontFamily: "sans",
      headingSize: 15,
    },

    "Nav Gallery": {
      heading: "GALLERY",
      buttonLink: "/gallery",
      fontFamily: "sans",
      headingSize: 15,
    },
"Nav Private Events": {
      heading: "PRIVATE EVENTS",
      buttonLink: "/private-events",
      fontFamily: "sans",
      headingSize: 15,
    },

   "Nav Contact": {
      heading: "CONTACT",
      buttonLink: "/contact",
      fontFamily: "sans",
      headingSize: 15,
    },
"Nav Book a Table": {
      heading: "BOOK A TABLE",
      buttonLink: "/#reserve",
      fontFamily: "sans",
      headingSize: 14,
    },

    /* =====================================================
       HOMEPAGE
       ===================================================== */

    "Hero": {
      eyebrow: "Yalıkavak · Bodrum",
      heading:
        "Good food tastes better\nwhen it is shared.",
      body:
        "Mediterranean flavours, long conversations\nand evenings made to remember.",
      buttonLabel: "RESERVE A TABLE",
      buttonLink: "/#reserve",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
      buttonSize: 14,
    },

    "Menus": {
      eyebrow: "The Menus",
      heading: "Mediterranean\nFood & Drinks",
      body:
        "Food · Drinks · Breakfast",
      buttonLabel: "VIEW MENU",
      buttonLink: "/food-menu?lang=en",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

  "Homepage Our Story": {
      eyebrow: "Our Story",
      heading: "A Family Story,\nA Shared Table.",
      body:
        "Long before La Lara became a restaurant, there was a table where everyone felt at home.\n\nIt belonged to our grandmother, Lara — a career woman with a big personality, a love of bringing people together and, admittedly, a little bit of diva spirit.\n\nHer kitchen was a place for long conversations, laughter, stories and food meant to be shared. That feeling became the inspiration behind La Lara.",
      buttonLabel: "READ OUR STORY",
      buttonLink: "/our-story",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Homepage Food Card": {
      heading: "Food",
      buttonLabel: "VIEW MENU",
      buttonLink: "/food-menu?lang=en",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Drinks Card": {
      heading: "Drinks",
      buttonLabel: "VIEW MENU",
      buttonLink: "/drinks-menu?lang=en",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Breakfast Card": {
      heading: "Breakfast",
      buttonLabel: "VIEW MENU",
      buttonLink: "/breakfast-menu?lang=en",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Story Detail": {
      eyebrow: "The story behind La Lara",
      heading: "The story behind\nLa Lara.",
      eyebrowSize: 13,
      headingSize: 34,
    },

    "Homepage Private Events": {
      eyebrow: "Private Events",
      heading: "Private Dining\n& Events",
      body: "Weddings, celebrations, private dinners and gatherings overlooking Yalıkavak Bay.\n\nTell us what you are planning and our team will help shape the occasion around your guests.",
      buttonLabel: "PLAN YOUR EVENT",
      buttonLink: "/private-events",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Experience Gallery": {
      eyebrow: "The La Lara Experience",
      heading:
        "From golden hour\nto late-night dining.",
      body:
        "Breakfast. Lunch. Sunset drinks. Dinner.\nAnd no reason to rush.",
      buttonLabel: "VIEW GALLERY",
      buttonLink: "/gallery",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Reservation Contact": {
      eyebrow: "Yalıkavak · Bodrum",
      heading: "Your table\nawaits.",
      body:
        "Come for the view. Stay for the food,\nthe people and the night.",
      buttonLabel: "RESERVE A TABLE",
      buttonLink: "/#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    /* =====================================================
       STORY PAGE
       ===================================================== */

    "Story Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Our Story",
      body:
        "The people, the memories and the little things that made La Lara.",
      eyebrowSize: 16,
      headingSize: 58,
      textSize: 18,
    },

    "Story Woman Intro": {
      eyebrow: "Where It Began",
      heading: "The Woman\nBehind the Name",
      body:
        "Every family has someone who brings everyone together. In ours, that person was Lara.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Story Lara Detail": {
      heading: "Warm, spirited\nand full of character.",
      body:
        "Our grandmother was far from ordinary. She was a career woman with a strong personality, an unmistakable sense of style and, we must admit, a little bit of a diva.\n\nShe loved to cook, but what she enjoyed even more was having people around her table.\n\nThere was always room for another guest, another story, another conversation. Meals had a wonderful habit of lasting longer than planned. People came together to laugh, to share news, sometimes to solve a problem, and always to enjoy something delicious.\n\nFor Lara, hospitality was never about making a grand impression. It was about making people feel welcome, comfortable and cared for.\n\nAnd somehow, she made it look effortless.",
      headingSize: 40,
      textSize: 17,
    },

    "Story Quote": {
      body:
        "When we began imagining our own restaurant,\nwe kept returning to those memories.",
      textSize: 28,
      fontFamily: "display",
    },

    "Story Place": {
      eyebrow: "A Place of Our Own",
      heading: "That feeling,\ncarried forward.",
      body:
        "Our aim was never to recreate her home. We wanted to carry the feeling of that table into a new place.\n\nA place where good food brings people together. Where conversations are never rushed. Where the atmosphere feels elegant without ever feeling formal.\n\nWarm, spirited and full of character.\n\nJust like Lara.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Pink Elephant": {
      eyebrow: "A Little Piece of Childhood",
      heading: "May You Dream\nof Pink Elephants",
      body:
        "There is one little phrase from our childhood that has stayed with us all these years.\n\nEvery night, before we went to sleep, our grandmother would say:\n\n“May you dream of pink elephants.”\n\nWe never questioned it much back then. It was simply something Lara said — a little unusual, a little mysterious and completely her own.\n\nAs children, we loved it without needing to understand it.\n\nToday, those words have taken on a new meaning for us.\n\nTo dream of pink elephants is to keep a little wonder in your life. To stay curious. To see possibilities where others might not. To never become too grown-up to dream of something extraordinary.\n\nAnd so, the pink elephant found its way into La Lara.\n\nTo someone discovering it for the first time, it may seem like a playful, unexpected symbol.\n\nTo us, it is something much more personal.\n\nA memory of our grandmother. A little piece of childhood. And a reminder that the things we love most do not always need an explanation.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "The People Behind Our Story": {
      eyebrow: "The People Behind Our Story",
      heading: "With love,\nfrom our family to yours.",
      body:
        "Although La Lara carries our grandmother's name, its story reaches beyond one person.\n\nIt belongs to the family tables we grew up around, the kitchens that welcomed us, the conversations we still remember and the grandparents who shaped the way we see the world.\n\nEach of them left us something that no recipe could ever capture: the understanding that sharing a meal is about so much more than food.\n\nLa Lara is our way of carrying those memories forward, while creating new ones with the people who join us.\n\nAnd, in its own small way, it is a thank you.\n\nTo Lara, Vova, Vitali & Raya.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Story CTA": {
      eyebrow: "La Lara · Yalıkavak",
      heading:
        "Come and make\nyour own memories.",
      buttonLabel: "VIEW OUR MENUS",
      buttonLink: "/#menus",
      eyebrowSize: 13,
      headingSize: 40,
      buttonSize: 14,
    },

        /* =====================================================
       GALLERY
       ===================================================== */

    "Gallery Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Moments\nat La Lara",
      body:
        "From quiet mornings to sunset dinners and evenings overlooking Yalıkavak Bay.",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Gallery CTA": {
      eyebrow: "Your Table Awaits",
      heading: "Experience La Lara\nfor yourself.",
      buttonLabel: "RESERVE A TABLE",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20request%20a%20reservation.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

        /* =====================================================
       PRIVATE EVENTS
       ===================================================== */

    "Private Events Hero": {
      eyebrow: "LA LARA · YALIKAVAK",
      heading:
        "Special Moments,\nat La Lara.",
      body:
        "From intimate gatherings to private celebrations, a beautiful setting in Yalıkavak for the moments worth remembering.",
      buttonLabel: "DISCOVER EVENTS",
      buttonLink: "#events",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Private Events Intro": {
      eyebrow: "PRIVATE EVENTS",
      heading:
        "Every celebration\nhas its own story.",
      body:
        "Whether it is an intimate evening, a special celebration or one of life's most important occasions, we approach every event at La Lara with its own character.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Lounge": {
      eyebrow: "LA LARA LOUNGE",
      heading:
        "Intimate\nEvents",
      body:
        "With its warm and welcoming atmosphere, La Lara Lounge offers a versatile setting for social gatherings and private celebrations.\n\nFrom relaxed evenings with friends to private parties, the space can be adapted to suit the character of your occasion.\n\nIts comfortable and informal atmosphere works beautifully for everything from afternoon gatherings to long evenings together.",
      buttonLabel:
        "ENQUIRE ABOUT THIS EVENT",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20enquire%20about%20hosting%20a%20private%20event.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Restaurant": {
      eyebrow:
        "LA LARA RESTAURANT & BAR",
      heading:
        "Private\nOccasions",
      body:
        "Selected areas of La Lara can be arranged for private occasions, creating a more personal setting for you and your guests.\n\nRomantic dinners, anniversaries, proposals, birthdays and gatherings with family, friends or colleagues can all be celebrated in a warm and elegant atmosphere.\n\nOur team will work with you to understand the occasion and help shape an experience around your plans.",
      buttonLabel:
        "PLAN YOUR OCCASION",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20enquire%20about%20hosting%20a%20private%20event.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Weddings": {
      eyebrow: "YALIKAVAK · BODRUM",
      heading:
        "Boutique\nWeddings",
      body:
        "Celebrate one of life's most special moments in the atmosphere of Yalıkavak, surrounded by the people who matter most.\n\nLa Lara brings together warm hospitality, thoughtful food and its distinctive setting for boutique weddings and personal celebrations.\n\nTell us about the day you imagine and we'll explore the event details, dining options and flow of the celebration with you.",
      buttonLabel:
        "WEDDING ENQUIRIES",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20enquire%20about%20hosting%20a%20private%20event.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events CTA": {
      eyebrow:
        "PRIVATE EVENTS · YALIKAVAK",
      heading:
        "Let's plan\nit together.",
      body:
        "Tell us the type of event, preferred date and approximate number of guests and our team will help with the next steps.",
      buttonLabel:
        "MESSAGE ON WHATSAPP",
      buttonLink:
        "https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20enquire%20about%20hosting%20a%20private%20event.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    /* =====================================================
       CONTACT
       ===================================================== */

    "Contact Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Come find\nyour table.",
      body:
        "Good food, long conversations\nand Yalıkavak evenings.",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Contact Information": {
      eyebrow: "Contact",
      heading: "We'd love\nto see you.",
      eyebrowSize: 13,
      headingSize: 78,
      headingFontFamily: "display",
      headingFontWeight: 400,
      headingLineHeight: 0.92,
      headingLetterSpacing: -3.9,
    },

    "Reservations": {
      eyebrow: "Reservations",
      heading: "Book a table",
      body:
        "For reservations and enquiries,\ncall or email our team.",
      buttonLabel: "RESERVE A TABLE",
      buttonLink: "/#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Social": {
      eyebrow: "Follow",
      heading: "Stay connected",
      body:
        "Follow La Lara for food,\nsunsets and moments from Yalıkavak.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Contact Map": {
      eyebrow: "Find Us",
      heading: "In the heart of\nYalıkavak.",
      buttonLabel: "OPEN IN GOOGLE MAPS ↗",
      eyebrowSize: 16,
      headingSize: 40,
      buttonSize: 14,
    },

    "Reservation CTA": {
      eyebrow: "Reservations",
      heading: "Your table\nawaits.",
      body:
        "Come for the view. Stay for the food,\nthe people and the night.",
      buttonLabel: "RESERVE A TABLE",
      buttonLink: "/#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    /* =====================================================
       FOOTER
       ===================================================== */

    "Footer Brand": {
      heading: "La Lara Restaurant & Bar",
      body: "Restaurant & Bar · Yalıkavak",
      headingSize: 18,
      textSize: 13,
    },

    "Footer Address": {
      eyebrow: "Visit",
      body:
        "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",
      buttonLabel: "GET DIRECTIONS ↗",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Navigation": {
      eyebrow: "Explore",
      body:
        "Menus\nOur Story\nGallery\nPrivate Events\nReservations\nContact",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Social": {
      eyebrow: "Follow",
      body:
        "Instagram\nFacebook\nTripadvisor",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Bottom": {
      body:
        "© 2026 La Lara Restaurant & Bar\nYalıkavak · Bodrum",
      textSize: 12,
    },
  },

  TR: {
    /* =====================================================
       NAVIGATION
       ===================================================== */

    "Nav Menu": {
      heading: "MENÜ",
      buttonLink: "/tr#menus",
      fontFamily: "sans",
      headingSize: 15,
    },

    "Nav Our Story": {
      heading: "HİKÂYEMİZ",
      buttonLink: "/tr/hikayemiz",
      fontFamily: "sans",
      headingSize: 15,
    },

   "Nav Gallery": {
      heading: "GALERİ",
      buttonLink: "/tr/galeri",
      fontFamily: "sans",
      headingSize: 15,
    },

    "Nav Private Events": {
      heading: "ÖZEL DAVETLER",
      buttonLink: "/tr/ozel-etkinlikler",
      fontFamily: "sans",
      headingSize: 15,
    },

    "Nav Contact": {
      heading: "İLETİŞİM",
      buttonLink: "/tr/iletisim",
      fontFamily: "sans",
      headingSize: 15,
    },

    "Nav Book a Table": {
      heading: "REZERVASYON YAP",
      buttonLink: "/tr#reserve",
      fontFamily: "sans",
      headingSize: 14,
    },

    /* =====================================================
       HOMEPAGE
       ===================================================== */

    "Hero": {
      eyebrow: "Yalıkavak · Bodrum",
      heading:
        "İyi yemek,\nsevdiklerinle daha güzel.",
      body:
        "Akdeniz lezzetleri, uzun sohbetler\nve hatırlanmaya değer akşamlar.",
      buttonLabel: "REZERVASYON YAP",
      buttonLink: "/tr#reserve",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
      buttonSize: 14,
    },

    "Menus": {
      eyebrow: "Menüler",
      heading: "Akdeniz\nLezzetleri & İçecekler",
      body: "Yemek · İçecek · Kahvaltı",
      buttonLabel: "MENÜYÜ GÖR",
      buttonLink: "/food-menu?lang=tr",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

   "Homepage Our Story": {
      eyebrow: "Hikâyemiz",
      heading:
        "Bir Aile Hikâyesi,\nPaylaşılan Bir Sofra.",
      body:
        "La Lara bir restoran olmadan çok önce, herkesin kendini evinde hissettiği bir sofra vardı.\n\nBu sofra büyükannemiz Lara’ya aitti. Sıcak, karakterli ve biraz da diva ruhuna sahip bir kadındı. Yemeğe, ailesine ve insanları bir araya getirmeye duyduğu sevgi, La Lara’da yaratmak istediğimiz her şeyin ilhamı oldu.\n\nBazı hikâyeler anlatılmadan bırakılamayacak kadar özeldir.",
      buttonLabel: "HİKÂYEMİZİ KEŞFET",
      buttonLink: "/tr/hikayemiz",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Homepage Food Card": {
      eyebrow: "Akdeniz",
      heading: "Yemek",
      buttonLabel: "MENÜYÜ GÖR",
      buttonLink: "/food-menu?lang=tr",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Drinks Card": {
      eyebrow: "Bar",
      heading: "İçecek",
      buttonLabel: "MENÜYÜ GÖR",
      buttonLink: "/drinks-menu?lang=tr",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Breakfast Card": {
      eyebrow: "Sabah",
      heading: "Kahvaltı",
      buttonLabel: "MENÜYÜ GÖR",
      buttonLink: "/breakfast-menu?lang=tr",
      headingSize: 28,
      buttonSize: 14,
    },

    "Homepage Story Detail": {
      eyebrow: "La Lara'nın Hikâyesi",
      heading: "İsmin Ardındaki\nKadın.",
      eyebrowSize: 13,
      headingSize: 34,
    },

    "Homepage Private Events": {
      eyebrow: "Özel Davetler",
      heading: "Özel Yemekler\n& Etkinlikler",
      body: "Yalıkavak Körfezi'ne karşı düğünler, doğum günleri, özel yemekler ve davetler.\n\nNasıl bir etkinlik planladığınızı bize anlatın; ekibimiz davetinizi size ve misafirlerinize göre şekillendirsin.",
      buttonLabel: "ETKİNLİĞİNİZİ PLANLAYIN",
      buttonLink: "/tr/ozel-etkinlikler",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Experience Gallery": {
      eyebrow: "La Lara Deneyimi",
      heading:
        "Gün batımından\ngecenin ilerleyen saatlerine.",
      body:
        "Kahvaltı. Öğle yemeği. Gün batımı kokteylleri. Akşam yemeği.\nVe acele etmek için hiçbir sebep yok.",
      buttonLabel: "GALERİYİ GÖR",
      buttonLink: "/tr/galeri",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    "Reservation Contact": {
      eyebrow: "Yalıkavak · Bodrum",
      heading: "Masanız\nsizi bekliyor.",
      body:
        "Manzara için gelin. Yemek, insanlar\nve gece için kalın.",
      buttonLabel: "REZERVASYON YAP",
      buttonLink: "/tr#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

    /* =====================================================
       STORY
       ===================================================== */

    "Story Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Hikâyemiz",
      body:
        "La Lara’yı var eden insanlar, anılar ve küçük detaylar.",
      eyebrowSize: 16,
      headingSize: 58,
      textSize: 18,
    },

    "Story Woman Intro": {
      eyebrow: "Her Şeyin Başladığı Yer",
      heading: "İsmin Ardındaki\nKadın",
      body:
        "Her ailede herkesi bir araya getiren biri vardır. Bizim ailemizde bu kişi Lara’ydı.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Story Lara Detail": {
      heading: "Sıcak, zarif\nve karakter dolu.",
      body:
        "Büyükannemiz hiç de hayal edebileceğiniz geleneksel büyükannelerden biri değildi. Kariyer sahibi, güçlü bir kişiliğe ve kendine özgü bir stile sahipti; kabul etmek gerekir ki biraz da diva ruhu vardı.\n\nYemek yapmayı severdi ama insanları sofrasında ağırlamayı daha da çok severdi.\n\nMasasında her zaman bir misafire, yeni bir hikâyeye ve başka bir sohbete yer vardı. Yemekler çoğu zaman planlanandan daha uzun sürerdi. İnsanlar gülmek, haberleri paylaşmak, bazen bir problemi çözmek ve her zaman güzel bir şeyler yemek için bir araya gelirdi.\n\nLara için misafirperverlik büyük bir gösteri yapmak değildi. İnsanların kendilerini rahat, değerli ve evlerinde hissetmelerini sağlamaktı.\n\nVe bunu son derece doğal bir şekilde yapardı.",
      headingSize: 40,
      textSize: 17,
    },

    "Story Quote": {
      body:
        "Kendi restoranımızı hayal etmeye başladığımızda,\ntekrar tekrar o anılara döndük.",
      textSize: 28,
      fontFamily: "display",
    },

    "Story Place": {
      eyebrow: "La Lara",
      heading: "O hissi\nyaşatmak.",
      body:
        "Amacımız onun evini yeniden yaratmak değildi. O sofradaki hissi yeni bir yere taşımak istedik.\n\nİyi yemeklerin insanları bir araya getirdiği bir yer. Sohbetlerin aceleye gelmediği, atmosferin zarif ama hiçbir zaman fazla resmi olmadığı bir yer.\n\nSıcak, canlı ve karakter dolu.\n\nTıpkı Lara gibi.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Pink Elephant": {
      eyebrow: "Çocukluğumuzdan Bir Parça",
      heading:
        "Pembe Filler Görmen\nDileğiyle",
      body:
        "Çocukken, yatmadan önce büyükannemiz hep \"Pembe filler görmen dileğiyle\" derdi.\n\nBunun ne anlama geldiğini hiç sorgulamadık. Sadece ona özgü, biraz tuhaf ama sevgi dolu alışkanlıklardan biriydi; kişisel, eğlenceli ve biraz da gizemli.\n\nBugün, onun bu sözlerine yeni bir anlam katmayı seviyoruz. \"Pembe filler görmen dileğiyle\" sözü; meraklı kalmanın, görünenin ötesini düşünmenin ve biraz daha büyük hayaller kurmanın bir hatırlatıcısı bizim için.\n\nPembe fil, restoranımızın simgesi haline geldi. Başkalarına belki son derece rastgele bir seçim gibi görünebilir; ama bizim için o, evimizden küçük bir parça taşıyor.",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "The People Behind Our Story": {
      eyebrow: "Emeği Geçenler",
      heading:
        "Sevgiyle,\nailemizden sizin ailenize.",
      body:
        "Restoran adını Lara’dan alsa da, bu hikaye tek bir kişiye ait değil.\n\nBu hikaye aynı zamanda çocukluğumuzu şekillendiren ve mutfaklarında büyüdüğümüz tüm büyükannelerimiz ve büyükbabalarımız için.\n\nYani burası, kendine has bir şekilde, bir teşekkür niteliğinde.\n\nLara, Vova, Vitali ve Raya’ya...",
      eyebrowSize: 16,
      headingSize: 40,
      textSize: 17,
    },

    "Story CTA": {
      eyebrow: "La Lara · Yalıkavak",
      heading:
        "Gelin, kendi\nanılarınıza yer açın.",
      buttonLabel: "MENÜLERİMİZİ GÖR",
      buttonLink: "/tr#menus",
      eyebrowSize: 13,
      headingSize: 40,
      buttonSize: 14,
    },

        /* =====================================================
       GALLERY
       ===================================================== */

    "Gallery Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "La Lara'dan\nAnlar",
      body:
        "Sakin sabahlardan gün batımı yemeklerine, Yalıkavak Körfezi'ne karşı uzayan akşamlara.",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Gallery CTA": {
      eyebrow: "Masanız Sizi Bekliyor",
      heading: "La Lara'yı\nkendiniz deneyimleyin.",
      buttonLabel: "REZERVASYON YAP",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20rezervasyon%20yapmak%20istiyorum.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
      buttonSize: 14,
    },

        /* =====================================================
       PRIVATE EVENTS
       ===================================================== */

    "Private Events Hero": {
      eyebrow: "LA LARA · YALIKAVAK",
      heading:
        "Özel Anlar,\nLa Lara'da.",
      body:
        "Samimi buluşmalardan özel davetlere ve kutlamalara kadar, unutulmaz anlar için Yalıkavak'ta size özel bir atmosfer.",
      buttonLabel:
        "ETKİNLİKLERİ KEŞFEDİN",
      buttonLink: "#events",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Private Events Intro": {
      eyebrow: "ÖZEL DAVETLER",
      heading:
        "Her kutlamanın\nkendine ait bir hikâyesi var.",
      body:
        "İster samimi bir akşam, ister özel bir kutlama, ister hayatınızın en önemli günlerinden biri olsun; La Lara'da her daveti kendi karakterine göre planlıyoruz.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Lounge": {
      eyebrow: "LA LARA LOUNGE",
      heading:
        "Samimi\nEtkinlikler",
      body:
        "Sıcak ve davetkâr atmosferiyle La Lara Lounge, sosyal buluşmalar ve özel kutlamalar için çok yönlü bir etkinlik alanı sunar.\n\nArkadaşlarla keyifli akşamlardan özel kapalı parti organizasyonlarına kadar, etkinliğinizin konseptine göre farklı düzenlemeler oluşturulabilir.\n\nRahat ve samimi atmosferi sayesinde öğleden sonra buluşmalarından uzun akşam sohbetlerine kadar farklı etkinliklere uyum sağlayan bir ortam sunar.",
      buttonLabel:
        "BU ETKİNLİK İÇİN BİLGİ AL",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20%C3%B6zel%20bir%20etkinlik%20d%C3%BCzenlemek%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Restaurant": {
      eyebrow:
        "LA LARA RESTAURANT & BAR",
      heading:
        "Özel\nDavetler",
      body:
        "La Lara'da seçili alanların rezerve edilmesi veya etkinliğinize özel düzenlenmesi seçenekleriyle kişisel davetler planlayabilirsiniz.\n\nRomantik akşam yemekleri, yıl dönümü kutlamaları, sürpriz evlilik teklifleri, doğum günleri, aile ve arkadaş buluşmaları için sıcak ve zarif bir atmosfer sunuyoruz.\n\nEkibimiz etkinliğinizin detaylarını sizinle birlikte değerlendirerek, davetinize uygun bir deneyim oluşturmanıza yardımcı olur.",
      buttonLabel:
        "DAVETİNİZİ PLANLAYIN",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20%C3%B6zel%20bir%20etkinlik%20d%C3%BCzenlemek%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events Weddings": {
      eyebrow: "YALIKAVAK · BODRUM",
      heading:
        "Özel Butik\nDüğünler",
      body:
        "Hayatınızın en özel günlerinden birini Yalıkavak'ın atmosferinde, size ve davetlilerinize özel bir kutlamaya dönüştürün.\n\nLa Lara'nın sıcak misafirperverlik anlayışı, özenli yemekleri ve kendine özgü atmosferi butik düğünler ve özel kutlamalar için bir araya geliyor.\n\nHayal ettiğiniz daveti bize anlatın. Organizasyonun detaylarını, yemek seçeneklerini ve etkinliğin akışını birlikte değerlendirelim.",
      buttonLabel:
        "DÜĞÜNÜNÜZ İÇİN BİLGİ AL",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20%C3%B6zel%20bir%20etkinlik%20d%C3%BCzenlemek%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Private Events CTA": {
      eyebrow:
        "ÖZEL DAVETLER · YALIKAVAK",
      heading:
        "Birlikte\nplanlayalım.",
      body:
        "Etkinliğinizin türünü, tarihini ve tahmini misafir sayısını bize iletin. Ekibimiz sizinle iletişime geçsin.",
      buttonLabel:
        "WHATSAPP'TAN YAZIN",
      buttonLink:
        "https://wa.me/905458941838?text=Merhaba%20La%20Lara%2C%20%C3%B6zel%20bir%20etkinlik%20d%C3%BCzenlemek%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    /* =====================================================
       CONTACT
       ===================================================== */

    "Contact Hero": {
      eyebrow: "La Lara · Yalıkavak",
      heading: "Sofranız\nsizi bekliyor.",
      body:
        "İyi yemekler, uzun sohbetler\nve Yalıkavak akşamları.",
      eyebrowSize: 13,
      headingSize: 58,
      textSize: 18,
    },

    "Contact Information": {
      eyebrow: "İletişim",
      heading: "Sizi La Lara'da\ngörmek isteriz.",
      eyebrowSize: 13,
      headingSize: 78,
      headingFontFamily: "display",
      headingFontWeight: 400,
      headingLineHeight: 0.92,
      headingLetterSpacing: -3.9,
    },

    "Reservations": {
      eyebrow: "Rezervasyon",
      heading: "Masa ayırtın",
      body:
        "Rezervasyon ve bilgi için\nbizi arayabilir veya e-posta gönderebilirsiniz.",
      buttonLabel: "REZERVASYON YAP",
      buttonLink: "/tr#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Social": {
      eyebrow: "Takip Et",
      heading: "Bağlantıda kalın",
      body:
        "La Lara’dan lezzetler, gün batımları\nve Yalıkavak’tan anlar.",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    "Contact Map": {
      eyebrow: "Konum",
      heading: "Yalıkavak’ın\nkalbinde.",
      buttonLabel: "GOOGLE MAPS'TE AÇ ↗",
      eyebrowSize: 16,
      headingSize: 40,
      buttonSize: 14,
    },

    "Reservation CTA": {
      eyebrow: "Rezervasyon",
      heading: "Masanız\nsizi bekliyor.",
      body:
        "Manzara için gelin. Yemek, insanlar\nve gece için kalın.",
      buttonLabel: "REZERVASYON YAP",
      buttonLink: "/tr#reserve",
      eyebrowSize: 13,
      headingSize: 40,
      textSize: 17,
    },

    /* =====================================================
       FOOTER
       ===================================================== */

    "Footer Brand": {
      heading: "La Lara Restaurant & Bar",
      body: "Restaurant & Bar · Yalıkavak",
      headingSize: 18,
      textSize: 13,
    },

    "Footer Address": {
      eyebrow: "Adres",
      body:
        "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",
      buttonLabel: "YOL TARİFİ AL ↗",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Navigation": {
      eyebrow: "Keşfet",
      body:
        "Menüler\nHikâyemiz\nGaleri\nÖzel Davetler\nRezervasyon\nİletişim",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Social": {
      eyebrow: "Takip Et",
      body:
        "Instagram\nFacebook\nTripadvisor",
      eyebrowSize: 13,
      textSize: 13,
    },

    "Footer Bottom": {
      body:
        "© 2026 La Lara Restaurant & Bar\nYalıkavak · Bodrum",
      textSize: 12,
    },
  },
};

function sectionKey(section: string) {
  return section
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function defaultFor(
  language: Language,
  section: string
): FormData {
  return {
    ...blank,
    ...(defaults[language]?.[section] ?? {}),
  };
}

export default function ContentPage() {
  const [language, setLanguage] =
    useState<Language>("EN");

  const [page, setPage] =
    useState<PageType>("Homepage");

  const [section, setSection] =
    useState("Hero");

  const [form, setForm] =
    useState<FormData>(blank);

  const [loading, setLoading] =
    useState(true);

  const [saveState, setSaveState] =
    useState("");

  // Typography is only written to Firestore when the editor actually
  // changes that specific typography control. Editing text alone must
  // never create style overrides on the live website.
  const [dirtyTypography, setDirtyTypography] =
    useState<Set<TypographyField>>(
      () => new Set()
    );

  const [discoveredSections, setDiscoveredSections] =
    useState<Record<PageType, string[]>>(() => ({
      Navigation: [],
      Homepage: [],
      "Our Story": [],
      Gallery: [],
      "Private Events": [],
      Contact: [],
      Footer: [],
      Unmapped: [],
    }));

  const [documentIds, setDocumentIds] =
    useState<Record<string, string>>({});

  const [discoveryReady, setDiscoveryReady] =
    useState(false);

  function normalizePage(
    value: unknown,
    sectionName: string
  ): PageType {
    const raw =
      typeof value === "string"
        ? value.trim().toLowerCase()
        : "";

    const compact = raw.replace(/[\s_-]+/g, "");

    if (
      compact === "navigation" ||
      compact === "nav"
    ) {
      return "Navigation";
    }

    if (
      compact === "homepage" ||
      compact === "home"
    ) {
      return "Homepage";
    }

    if (
      compact === "ourstory" ||
      compact === "story"
    ) {
      return "Our Story";
    }

    if (compact === "gallery") {
      return "Gallery";
    }

    if (
      compact === "privateevents" ||
      compact === "events"
    ) {
      return "Private Events";
    }

    if (compact === "contact") {
      return "Contact";
    }

    if (compact === "footer") {
      return "Footer";
    }

    // Older records sometimes have missing/inconsistent page values.
    // If the section is one of our known sections, recover its page here.
    for (const [knownPage, knownSections] of Object.entries(pageSections)) {
      if (
        knownPage !== "Unmapped" &&
        knownSections.includes(sectionName)
      ) {
        return knownPage as PageType;
      }
    }

    return "Unmapped";
  }

  useEffect(() => {
    let cancelled = false;

    async function discoverContent() {
      setDiscoveryReady(false);

      try {
        const snapshot = await getDocs(
          collection(db, "siteContent")
        );

        if (cancelled) return;

        const nextSections: Record<PageType, string[]> = {
          Navigation: [],
          Homepage: [],
          "Our Story": [],
          Gallery: [],
          "Private Events": [],
          Contact: [],
          Footer: [],
          Unmapped: [],
        };

        const nextIds: Record<string, string> = {};

        snapshot.forEach((item) => {
          const data = item.data();

          const idLanguage: Language | null =
            item.id.startsWith("en-")
              ? "EN"
              : item.id.startsWith("tr-")
                ? "TR"
                : data.language === "en"
                  ? "EN"
                  : data.language === "tr"
                    ? "TR"
                    : null;

          if (!idLanguage) return;

          const sectionName =
            typeof data.section === "string" &&
            data.section.trim()
              ? data.section.trim()
              : item.id
                  .replace(/^en-/, "")
                  .replace(/^tr-/, "");

          const resolvedPage =
            normalizePage(
              data.page,
              sectionName
            );

          if (
            !nextSections[resolvedPage].includes(
              sectionName
            )
          ) {
            nextSections[resolvedPage].push(
              sectionName
            );
          }

          nextIds[
            `${idLanguage}:${sectionName}`
          ] = item.id;
        });

        for (const key of Object.keys(
          nextSections
        ) as PageType[]) {
          nextSections[key].sort((a, b) => {
            const known =
              pageSections[key] ?? [];

            const ai = known.indexOf(a);
            const bi = known.indexOf(b);

            if (ai !== -1 && bi !== -1) {
              return ai - bi;
            }

            if (ai !== -1) return -1;
            if (bi !== -1) return 1;

            return a.localeCompare(b);
          });
        }

        setDiscoveredSections(nextSections);
        setDocumentIds(nextIds);
      } catch (error) {
        console.error(
          "Could not discover siteContent:",
          error
        );

        setSaveState(
          "Could not discover Firestore content."
        );
      } finally {
        if (!cancelled) {
          setDiscoveryReady(true);
        }
      }
    }

    discoverContent();

    return () => {
      cancelled = true;
    };
  }, []);

  const sections = useMemo(() => {
    const known =
      pageSections[page] ?? [];

    const discovered =
      discoveredSections[page] ?? [];

    // Old design stays the same, but Firestore records are merged in.
    return Array.from(
      new Set([
        ...known,
        ...discovered,
      ])
    );
  }, [page, discoveredSections]);

  const documentId =
    documentIds[
      `${language}:${section}`
    ] ??
    `${language.toLowerCase()}-${sectionKey(section)}`;

  useEffect(() => {
    const available =
      Array.from(
        new Set([
          ...(pageSections[page] ?? []),
          ...(discoveredSections[page] ?? []),
        ])
      );

    if (available.length > 0) {
      setSection(available[0]);
    } else {
      setSection("");
    }
  }, [page, discoveredSections]);


  useEffect(() => {
    async function loadContent() {
      if (!discoveryReady || !section) {
        setLoading(!discoveryReady);
        return;
      }

      setLoading(true);
      setSaveState("");
      setDirtyTypography(new Set());

      try {
        const snapshot = await getDoc(
          doc(db, "siteContent", documentId)
        );

        const fallback =
          defaultFor(language, section);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setForm({
            eyebrow:
              data.eyebrow ??
              fallback.eyebrow,

            heading:
              data.heading ??
              fallback.heading,

            body:
              data.body ??
              fallback.body,

            buttonLabel:
              data.buttonLabel ??
              fallback.buttonLabel,

            buttonLink:
              data.buttonLink ??
              fallback.buttonLink,

            eyebrowSize:
              data.eyebrowSize ??
              fallback.eyebrowSize,

            headingSize:
              data.headingSize ??
              fallback.headingSize,

            textSize:
              data.textSize ??
              fallback.textSize,

            buttonSize:
              data.buttonSize ??
              fallback.buttonSize,

            fontFamily:
              data.fontFamily ??
              fallback.fontFamily,

            fontWeight:
              data.fontWeight ??
              fallback.fontWeight,

            lineHeight:
              data.lineHeight ??
              fallback.lineHeight,

            letterSpacing:
              data.letterSpacing ??
              fallback.letterSpacing,

            eyebrowFontFamily:
              data.eyebrowFontFamily ?? data.fontFamily ?? fallback.eyebrowFontFamily,
            headingFontFamily:
              data.headingFontFamily ?? data.fontFamily ?? fallback.headingFontFamily,
            textFontFamily:
              data.textFontFamily ?? data.fontFamily ?? fallback.textFontFamily,
            buttonFontFamily:
              data.buttonFontFamily ?? data.fontFamily ?? fallback.buttonFontFamily,

            eyebrowFontWeight:
              data.eyebrowFontWeight ?? data.fontWeight ?? fallback.eyebrowFontWeight,
            headingFontWeight:
              data.headingFontWeight ?? data.fontWeight ?? fallback.headingFontWeight,
            textFontWeight:
              data.textFontWeight ?? data.fontWeight ?? fallback.textFontWeight,
            buttonFontWeight:
              data.buttonFontWeight ?? data.fontWeight ?? fallback.buttonFontWeight,

            eyebrowLineHeight:
              data.eyebrowLineHeight ?? data.lineHeight ?? fallback.eyebrowLineHeight,
            headingLineHeight:
              data.headingLineHeight ?? data.lineHeight ?? fallback.headingLineHeight,
            textLineHeight:
              data.textLineHeight ?? data.lineHeight ?? fallback.textLineHeight,
            buttonLineHeight:
              data.buttonLineHeight ?? data.lineHeight ?? fallback.buttonLineHeight,

            eyebrowLetterSpacing:
              data.eyebrowLetterSpacing ?? data.letterSpacing ?? fallback.eyebrowLetterSpacing,
            headingLetterSpacing:
              data.headingLetterSpacing ?? data.letterSpacing ?? fallback.headingLetterSpacing,
            textLetterSpacing:
              data.textLetterSpacing ?? data.letterSpacing ?? fallback.textLetterSpacing,
            buttonLetterSpacing:
              data.buttonLetterSpacing ?? data.letterSpacing ?? fallback.buttonLetterSpacing,

            visible:
              data.visible ??
              fallback.visible,
          });
        } else {
          setForm(fallback);
        }
      } catch (error) {
        console.error(error);

        setForm(
          defaultFor(language, section)
        );

        setSaveState(
          "Could not load content."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [
    documentId,
    language,
    section,
    discoveryReady,
  ]);

  function updateField<
    K extends keyof FormData
  >(
    key: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (isTypographyField(key)) {
      setDirtyTypography((current) => {
        const next = new Set(current);
        next.add(key);
        return next;
      });
    }
  }

  async function saveContent(
    status: "draft" | "published"
  ) {
    if (!auth.currentUser) {
      setSaveState(
        "Please sign in again."
      );
      return;
    }

    if (!section) {
      setSaveState(
        "No section selected."
      );
      return;
    }

    setSaveState("Saving...");

    try {
      // IMPORTANT:
      // Text/content is always safe to publish.
      // Typography is sparse: only controls explicitly changed during
      // this edit session are written. This keeps the website's original
      // CSS as the source of truth when the user only edits copy.
      const payload: Record<string, unknown> = {
        eyebrow: form.eyebrow,
        heading: form.heading,
        body: form.body,
        buttonLabel: form.buttonLabel,
        buttonLink: form.buttonLink,
        visible: form.visible,

        language:
          language.toLowerCase(),

        page:
          page.toLowerCase(),

        section,
        status,

        updatedBy:
          auth.currentUser.uid,

        updatedAt:
          serverTimestamp(),
      };

      dirtyTypography.forEach((key) => {
        payload[key] = form[key];
      });

      await setDoc(
        doc(
          db,
          "siteContent",
          documentId
        ),
        payload,
        {
          merge: true,
        }
      );

      setDirtyTypography(new Set());

      setSaveState(
        status === "published"
          ? "Published successfully. Original site typography was preserved unless you changed a typography control."
          : "Draft saved. Original site typography was preserved unless you changed a typography control."
      );
    } catch (error) {
      console.error(error);

      setSaveState(
        "Save failed."
      );
    }
  }

  const previewStyle = (
    role: "eyebrow" | "heading" | "text" | "button"
  ) => {
    const family =
      role === "eyebrow" ? form.eyebrowFontFamily :
      role === "heading" ? form.headingFontFamily :
      role === "text" ? form.textFontFamily : form.buttonFontFamily;

    const size =
      role === "eyebrow" ? form.eyebrowSize :
      role === "heading" ? form.headingSize :
      role === "text" ? form.textSize : form.buttonSize;

    const weight =
      role === "eyebrow" ? form.eyebrowFontWeight :
      role === "heading" ? form.headingFontWeight :
      role === "text" ? form.textFontWeight : form.buttonFontWeight;

    const lineHeight =
      role === "eyebrow" ? form.eyebrowLineHeight :
      role === "heading" ? form.headingLineHeight :
      role === "text" ? form.textLineHeight : form.buttonLineHeight;

    const letterSpacing =
      role === "eyebrow" ? form.eyebrowLetterSpacing :
      role === "heading" ? form.headingLetterSpacing :
      role === "text" ? form.textLetterSpacing : form.buttonLetterSpacing;

    return {
      fontFamily:
        family === "sans"
          ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
          : '"Iowan Old Style", Baskerville, "Times New Roman", serif',
      fontSize: `${size}px`,
      fontWeight: weight,
      lineHeight,
      letterSpacing: `${letterSpacing}px`,
      fontSynthesis: "none" as const,
      whiteSpace: "pre-line" as const,
    };
  };

  return (
    <AdminShell
      eyebrow="Website"
      title="Site Editor"
    >
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">
            Website CMS
          </p>

          <h1>
            Edit the website.
          </h1>
          <p className="admin-save-message">
            Firestore siteContent records are discovered automatically. Text changes preserve the website's original CSS typography. Font, size, weight, line height and letter spacing are only published when you explicitly change those controls.
          </p>
        </div>

        <div className="admin-segmented">
          <button
            className={
              language === "EN"
                ? "active"
                : ""
            }
            onClick={() =>
              setLanguage("EN")
            }
          >
            EN
          </button>

          <button
            className={
              language === "TR"
                ? "active"
                : ""
            }
            onClick={() =>
              setLanguage("TR")
            }
          >
            TR
          </button>
        </div>
      </div>

      {/* PAGE SELECTOR */}

      <div className="website-editor-pages">
        {(
          Object.keys(
            pageSections
          ) as PageType[]
        ).map((item) => (
          <button
            key={item}
            type="button"
            className={
              page === item
                ? "active"
                : ""
            }
            onClick={() =>
              setPage(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="editor-layout">
        {/* =============================================
            SECTIONS
            ============================================= */}

        <aside className="editor-sections">
          <span>
            {page}
          </span>

          {sections.map((item) => (
            <button
              key={item}
              type="button"
              className={
                section === item
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSection(item)
              }
            >
              {item}
            </button>
          ))}
        </aside>

        {/* =============================================
            FORM
            ============================================= */}

        <section className="editor-form admin-panel-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-eyebrow">
                {language} · {page}
              </p>

              <h2>
                {section}
              </h2>
            </div>

            <label className="admin-visibility-toggle">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(event) =>
                  updateField(
                    "visible",
                    event.target.checked
                  )
                }
              />

              <span />

              <strong>
                {form.visible
                  ? "Visible"
                  : "Hidden"}
              </strong>
            </label>
          </div>

          {loading ? (
            <p className="admin-save-message">
              Loading content...
            </p>
          ) : (
            <>
              <label className="admin-field">
                <span>
                  Eyebrow / small label
                </span>

                <input
                  value={form.eyebrow}
                  onChange={(event) =>
                    updateField(
                      "eyebrow",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-field">
                <span>Heading</span>

                <textarea
                  rows={3}
                  value={form.heading}
                  onChange={(event) =>
                    updateField(
                      "heading",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="admin-field">
                <span>Body copy</span>

                <textarea
                  rows={9}
                  value={form.body}
                  onChange={(event) =>
                    updateField(
                      "body",
                      event.target.value
                    )
                  }
                />
              </label>

              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>
                    Button label
                  </span>

                  <input
                    value={
                      form.buttonLabel
                    }
                    onChange={(event) =>
                      updateField(
                        "buttonLabel",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>
                    Button link
                  </span>

                  <input
                    value={
                      form.buttonLink
                    }
                    onChange={(event) =>
                      updateField(
                        "buttonLink",
                        event.target.value
                      )
                    }
                    placeholder="/gallery"
                  />
                </label>
              </div>

              {/* TYPOGRAPHY — every visible text role is independent */}
              <div className="editor-subheading"><span>Eyebrow typography</span></div>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Font family</span>
                  <select value={form.eyebrowFontFamily} onChange={(e) => updateField("eyebrowFontFamily", e.target.value as FormData["eyebrowFontFamily"])}>
                    <option value="display">Display / Serif</option>
                    <option value="sans">Sans Serif</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Size (px)</span>
                  <input type="number" min="8" max="60" value={form.eyebrowSize} onChange={(e) => updateField("eyebrowSize", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Weight</span>
                  <select value={form.eyebrowFontWeight} onChange={(e) => updateField("eyebrowFontWeight", Number(e.target.value))}>
                    <option value="300">Light 300</option><option value="400">Regular 400</option><option value="500">Medium 500</option><option value="600">Semi Bold 600</option><option value="700">Bold 700</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Line height</span>
                  <input type="number" min="0.8" max="2.5" step="0.05" value={form.eyebrowLineHeight} onChange={(e) => updateField("eyebrowLineHeight", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Letter spacing (px)</span>
                  <input type="number" min="-5" max="20" step="0.1" value={form.eyebrowLetterSpacing} onChange={(e) => updateField("eyebrowLetterSpacing", Number(e.target.value))} />
                </label>
              </div>
              <div className="editor-subheading"><span>Heading typography</span></div>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Font family</span>
                  <select value={form.headingFontFamily} onChange={(e) => updateField("headingFontFamily", e.target.value as FormData["headingFontFamily"])}>
                    <option value="display">Display / Serif</option>
                    <option value="sans">Sans Serif</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Size (px)</span>
                  <input type="number" min="8" max="180" value={form.headingSize} onChange={(e) => updateField("headingSize", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Weight</span>
                  <select value={form.headingFontWeight} onChange={(e) => updateField("headingFontWeight", Number(e.target.value))}>
                    <option value="300">Light 300</option><option value="400">Regular 400</option><option value="500">Medium 500</option><option value="600">Semi Bold 600</option><option value="700">Bold 700</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Line height</span>
                  <input type="number" min="0.8" max="2.5" step="0.05" value={form.headingLineHeight} onChange={(e) => updateField("headingLineHeight", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Letter spacing (px)</span>
                  <input type="number" min="-5" max="20" step="0.1" value={form.headingLetterSpacing} onChange={(e) => updateField("headingLetterSpacing", Number(e.target.value))} />
                </label>
              </div>
              <div className="editor-subheading"><span>Body typography</span></div>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Font family</span>
                  <select value={form.textFontFamily} onChange={(e) => updateField("textFontFamily", e.target.value as FormData["textFontFamily"])}>
                    <option value="display">Display / Serif</option>
                    <option value="sans">Sans Serif</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Size (px)</span>
                  <input type="number" min="8" max="80" value={form.textSize} onChange={(e) => updateField("textSize", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Weight</span>
                  <select value={form.textFontWeight} onChange={(e) => updateField("textFontWeight", Number(e.target.value))}>
                    <option value="300">Light 300</option><option value="400">Regular 400</option><option value="500">Medium 500</option><option value="600">Semi Bold 600</option><option value="700">Bold 700</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Line height</span>
                  <input type="number" min="0.8" max="2.5" step="0.05" value={form.textLineHeight} onChange={(e) => updateField("textLineHeight", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Letter spacing (px)</span>
                  <input type="number" min="-5" max="20" step="0.1" value={form.textLetterSpacing} onChange={(e) => updateField("textLetterSpacing", Number(e.target.value))} />
                </label>
              </div>
              <div className="editor-subheading"><span>Button typography</span></div>
              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Font family</span>
                  <select value={form.buttonFontFamily} onChange={(e) => updateField("buttonFontFamily", e.target.value as FormData["buttonFontFamily"])}>
                    <option value="display">Display / Serif</option>
                    <option value="sans">Sans Serif</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Size (px)</span>
                  <input type="number" min="8" max="60" value={form.buttonSize} onChange={(e) => updateField("buttonSize", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Weight</span>
                  <select value={form.buttonFontWeight} onChange={(e) => updateField("buttonFontWeight", Number(e.target.value))}>
                    <option value="300">Light 300</option><option value="400">Regular 400</option><option value="500">Medium 500</option><option value="600">Semi Bold 600</option><option value="700">Bold 700</option>
                  </select>
                </label>
                <label className="admin-field">
                  <span>Line height</span>
                  <input type="number" min="0.8" max="2.5" step="0.05" value={form.buttonLineHeight} onChange={(e) => updateField("buttonLineHeight", Number(e.target.value))} />
                </label>
                <label className="admin-field">
                  <span>Letter spacing (px)</span>
                  <input type="number" min="-5" max="20" step="0.1" value={form.buttonLetterSpacing} onChange={(e) => updateField("buttonLetterSpacing", Number(e.target.value))} />
                </label>
              </div>
              {saveState && (
                <p className="admin-save-message">
                  {saveState}
                </p>
              )}

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-button secondary"
                  onClick={() =>
                    saveContent("draft")
                  }
                >
                  Save draft
                </button>

                <button
                  type="button"
                  className="admin-button primary"
                  onClick={() =>
                    saveContent(
                      "published"
                    )
                  }
                >
                  Publish changes
                </button>
              </div>
            </>
          )}
        </section>

        {/* =============================================
            PREVIEW
            ============================================= */}

        <aside className="editor-preview admin-panel-card">
          <div className="preview-toolbar">
            <span>
              Live preview
            </span>

            <strong>
              {form.visible
                ? "Visible"
                : "Hidden"}
            </strong>
          </div>

          <div
            className={`preview-canvas ${
              !form.visible
                ? "is-hidden"
                : ""
            }`}
          >
            {form.eyebrow && (
              <span
                style={previewStyle("eyebrow")}
              >
                {form.eyebrow}
              </span>
            )}

            {form.heading && (
              <h3
                style={previewStyle("heading")}
              >
                {form.heading}
              </h3>
            )}

            {form.body && (
              <p
                style={previewStyle("text")}
              >
                {form.body}
              </p>
            )}

            {(form.buttonLabel ||
              form.buttonLink) && (
              <div className="preview-button-wrap">
                <button
                  type="button"
                  className="admin-button secondary"
                  style={previewStyle("button")}
                >
                  {form.buttonLabel ||
                    "Button"}
                </button>

                {form.buttonLink && (
                  <small>
                    {form.buttonLink}
                  </small>
                )}
              </div>
            )}

            {!form.visible && (
              <div className="preview-hidden-message">
                This section is hidden
                on the website.
              </div>
            )}
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}