"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Locale = "en" | "tr";

type MenuItem = {
  name: string;
  description?: string;
  price?: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
  note?: string;
};

const menu: Record<Locale, MenuSection[]> = {
  en: [
    {
      title: "Lara's Breakfast",
      items: [
        {
          name: "Lara's Breakfast",
          description:
            "Cheese selection, breakfast delicacies, fresh vegetables, jams, honey, bread basket. Tea and water included. Choose your eggs: fried eggs · omelette · menemen · scrambled eggs · boiled egg",
          price: "950",
        },
        {
          name: "Make It Deluxe",
          description:
            "Unlimited freshly squeezed juices · Unlimited speciality coffee · One Mimosa",
          price: "+650 TL",
        },
      ],
    },

    {
      title: "Breakfast Bruschetta",
      items: [
        {
          name: "Salmon Bruschetta",
          description: "smoked salmon, cream cheese, capers, rocket",
          price: "590",
        },
        {
          name: "Avocado Bruschetta",
          description: "fried eggs",
          price: "490",
        },
        {
          name: "Pastrami Bruschetta",
          description: "cheese, tomato, pesto",
          price: "550",
        },
      ],
    },

    {
      title: "Eggs",
      items: [
        { name: "Menemen", price: "430" },
        { name: "Omelette", price: "390" },
        { name: "Fried Eggs", price: "260" },
        { name: "Scrambled Eggs", price: "320" },
        { name: "Boiled Egg", price: "150" },
      ],
    },

    {
      title: "Breakfast Favourites",
      items: [
        {
          name: "Breakfast Salad",
          description: "pastrami, parmesan, egg, avocado, rocket, tomato",
          price: "750",
        },
        {
          name: "Fried Sucuk",
          description: "tomato, cheese",
          price: "450",
        },
        {
          name: "Grilled Halloumi",
          description: "butter, fresh basil",
          price: "390",
        },
        {
          name: "Grilled Cheese Toast",
          description: "french fries",
          price: "390",
        },
      ],
    },

    {
      title: "Sweet Morning",
      items: [
        {
          name: "Pancakes",
          description: "chocolate, fresh fruit",
          price: "450",
        },
        {
          name: "Granola Bowl",
          description: "yogurt, mixed nuts, fresh fruit",
          price: "420",
        },
        {
          name: "French Toast",
          description: "fresh fruit, honey, kaymak",
          price: "420",
        },
        {
          name: "Oat Porridge",
          description: "fresh fruit",
          price: "390",
        },
      ],
      note: "Available with your choice of milk.",
    },

    {
      title: "Extra Toppings",
      items: [
        { name: "Mixed Vegetables", price: "120" },
        { name: "Mushrooms", price: "120" },
        { name: "Cheese", price: "170" },
        { name: "Sucuk", price: "250" },
      ],
    },

    {
      title: "Fresh & Sparkling",
      items: [
        {
          name: "Fresh Juices",
          description: "orange · apple · carrot",
          price: "390",
        },
        {
          name: "Green Detox Juice",
          description: "apple, cucumber, celery, lemon",
          price: "430",
        },
        {
          name: "Lemon Spritz",
          description: "lemon, mint, sugar syrup, soda",
          price: "340",
        },
        {
          name: "Lara's Mimosa",
          description: "sparkling wine, orange juice, elderflower liqueur",
          price: "700",
        },
      ],
    },

    {
      title: "Coffee",
      items: [
        { name: "Espresso / double", price: "180 / 250" },
        { name: "Americano", price: "230" },
        { name: "Cappuccino", price: "270" },
        { name: "Caffè Latte", price: "290" },
        { name: "Turkish Coffee / double", price: "150 / 220" },
        {
          name: "Extra Syrup",
          description: "hazelnut · chocolate · almond · banana",
          price: "40",
        },
        {
          name: "Milk Alternatives",
          description: "coconut · almond · oat",
          price: "50",
        },
      ],
    },

    {
      title: "Iced Coffee",
      items: [
        { name: "Americano", price: "260" },
        { name: "Latte", price: "320" },
        { name: "Vanilla Latte", price: "360" },
        { name: "Caramel Latte", price: "360" },
      ],
    },

    {
      title: "Tea",
      items: [
        {
          name: "Herbal Tea cup / pot",
          description: "green · chamomile · rosehip · fruit",
          price: "160 / 350",
        },
        { name: "Turkish Tea", price: "110" },
      ],
    },

    {
      title: "Water & Juice",
      items: [
        { name: "Water 700 ml", price: "170" },
        {
          name: "Bottled Water 400 ml / 1 l",
          price: "130 / 240",
        },
        {
          name: "Sparkling Water 250 ml / 750 ml",
          price: "150 / 290",
        },
        {
          name: "Fruit Juice",
          description: "cherry · apple · pineapple",
          price: "210",
        },
      ],
    },
  ],

  tr: [
    {
      title: "Lara'nın Kahvaltısı",
      items: [
        {
          name: "Lara'nın Kahvaltısı",
          description:
            "Yerel peynir çeşitleri, kahvaltılık lezzetler, taze sebzeler, reçel, bal ve ekmek sepeti. Çay ve su dahildir. Şunu seçin: göz yumurta · omlet · menemen · çırpılmış yumurta · haşlanmış yumurta",
          price: "950",
        },
        {
          name: "Make It Deluxe",
          description:
            "Sınırsız taze sıkılmış meyve suyu · Sınırsız özel kahve seçenekleri · 1 kadeh Mimosa",
          price: "+650 TL",
        },
      ],
    },

    {
      title: "Kahvaltı Bruschetta",
      items: [
        {
          name: "Somon Füme Bruschetta",
          description: "krem peynir, kapari, roka",
          price: "590",
        },
        {
          name: "Avokado Bruschetta",
          description: "göz yumurta",
          price: "490",
        },
        {
          name: "Pastırmalı Bruschetta",
          description: "kaşar, domates, pesto sos",
          price: "550",
        },
      ],
    },

    {
      title: "Yumurtalar",
      items: [
        { name: "Menemen", price: "430" },
        { name: "Omlet", price: "390" },
        { name: "Göz Yumurta", price: "260" },
        { name: "Çırpılmış Yumurta", price: "320" },
        { name: "Haşlanmış Yumurta", price: "150" },
      ],
    },

    {
      title: "Kahvaltı Favorileri",
      items: [
        {
          name: "Kahvaltı Salatası",
          description: "pastırma, parmesan, yumurta, avokado, roka, domates",
          price: "750",
        },
        {
          name: "Sahanda Sucuk",
          description: "domates, kaşar",
          price: "450",
        },
        {
          name: "Izgara Hellim Peyniri",
          description: "tereyağı, taze fesleğen",
          price: "390",
        },
        {
          name: "Kaşarlı Tost",
          description: "patates kızartması",
          price: "390",
        },
      ],
    },

    {
      title: "Tatlı Sabah",
      items: [
        {
          name: "Pankek",
          description: "çikolata, taze meyveler",
          price: "450",
        },
        {
          name: "Granola Bowl",
          description: "yoğurt, çeşitli kuruyemişler, taze meyveler",
          price: "420",
        },
        {
          name: "French Toast",
          description: "taze meyveler, bal, kaymak",
          price: "420",
        },
        {
          name: "Yulaf Ezmesi",
          description: "taze meyveler",
          price: "390",
        },
      ],
      note: "Süt alternatifleri ile hazırlanabilir.",
    },

    {
      title: "Ekstra Malzemeler",
      items: [
        { name: "Karışık Sebzeli", price: "120" },
        { name: "Mantarlı", price: "120" },
        { name: "Peynirli", price: "170" },
        { name: "Sucuklu", price: "250" },
      ],
    },

    {
      title: "Ferah & Köpüklü",
      items: [
        {
          name: "Taze Meyve Suyu",
          description: "portakal · elma · havuç",
          price: "390",
        },
        {
          name: "Green Detox Juice",
          description: "elma, salatalık, kereviz, limon",
          price: "430",
        },
        {
          name: "Lemon Spritz",
          description: "limon, nane, şeker şurubu, soda",
          price: "340",
        },
        {
          name: "Lara'nın Mimosası",
          description: "köpüklü şarap, portakal suyu, mürver çiçeği likörü",
          price: "700",
        },
      ],
    },

    {
      title: "Kahve",
      items: [
        { name: "Espresso / duble", price: "180 / 250" },
        { name: "Americano", price: "230" },
        { name: "Cappuccino", price: "270" },
        { name: "Caffè Latte", price: "290" },
        { name: "Türk Kahvesi / duble", price: "150 / 220" },
        {
          name: "Şurup İlavesi",
          description: "fındık · çikolata · badem · muz",
          price: "40",
        },
        {
          name: "Süt Alternatifleri",
          description: "hindistan cevizi · badem · yulaf",
          price: "50",
        },
      ],
    },

    {
      title: "Soğuk Kahve",
      items: [
        { name: "Americano", price: "260" },
        { name: "Latte", price: "320" },
        { name: "Vanilya Latte", price: "360" },
        { name: "Karamel Latte", price: "360" },
      ],
    },

    {
      title: "Çay",
      items: [
        {
          name: "Bitki Çayı fincan / demlik",
          description: "yeşil · papatya · kuşburnu · meyve",
          price: "160 / 350",
        },
        { name: "Çay", price: "110" },
      ],
    },

    {
      title: "Su & Meyve Suyu",
      items: [
        { name: "Su 700 ml", price: "170" },
        {
          name: "Şişe Su 400 ml / 1 l",
          price: "130 / 240",
        },
        {
          name: "Soda 250 ml / 750 ml",
          price: "150 / 290",
        },
        {
          name: "Meyve Suyu",
          description: "kiraz · elma · ananas",
          price: "210",
        },
      ],
    },
  ],
};

export default function BreakfastMenuPage() {
  const [locale, setLocale] = useState<Locale>("en");

  const isTR = locale === "tr";

  return (
    <main className="restaurant-menu-page">

      {/* PHOTO HEADER */}
      <div
        className="restaurant-menu-header-bg"
        style={{
          backgroundImage: "url('/images/home/6.jpg')",
        }}
      >
        <div className="restaurant-menu-header-overlay" />

        <Header
  locale={locale}
  onLocaleChange={setLocale}
/>
      </div>

      {/* FOOD / DRINKS / BREAKFAST */}
      <nav
        className="restaurant-menu-tabs"
        aria-label="Menu navigation"
      >
        <Link href="/food-menu">
          {isTR ? "YEMEK" : "FOOD"}
        </Link>

        <Link href="/drinks-menu">
          {isTR ? "İÇECEK" : "DRINKS"}
        </Link>

        <Link href="/breakfast-menu" className="active">
          {isTR ? "KAHVALTI" : "BREAKFAST"}
        </Link>
      </nav>

      {/* PINK ELEPHANT WATERMARK */}
      <div
        className="restaurant-menu-watermark"
        aria-hidden="true"
      >
        <Image
          src="/pink-elephant.ico"
          alt=""
          width={650}
          height={650}
        />
      </div>

      {/* TITLE */}
      <section className="restaurant-menu-heading">
        <h1>
          {isTR ? "Kahvaltı Menüsü" : "Breakfast Menu"}
        </h1>

        <span>Restaurant &amp; Bar</span>
      </section>

      {/* MENU */}
      <section className="restaurant-menu-grid">
        {menu[locale].map((section) => (
          <section
            className="restaurant-menu-section"
            key={section.title}
          >
            <h2>{section.title}</h2>

            <div className="restaurant-menu-items">
              {section.items.map((item) => (
                <article
                  className="restaurant-menu-item"
                  key={`${section.title}-${item.name}`}
                >
                  <div className="restaurant-menu-item-main">
                    <h3>{item.name}</h3>

                    {item.price && (
                      <strong>{item.price}</strong>
                    )}
                  </div>

                  {item.description && (
                    <p>{item.description}</p>
                  )}
                </article>
              ))}
            </div>

            {section.note && (
              <p className="restaurant-menu-section-note">
                {section.note}
              </p>
            )}
          </section>
        ))}
      </section>

      {/* BOTTOM */}
      <section className="restaurant-menu-note">
        <p>
          {isTR
            ? "Lütfen sipariş vermeden önce alerjileriniz veya özel beslenme gereksinimleriniz hakkında ekibimizi bilgilendiriniz."
            : "Please inform our team of any allergies or dietary requirements before ordering."}
        </p>

        <Link href={isTR ? "/tr" : "/"}>
          {isTR ? "LA LARA'YA DÖN" : "BACK TO LA LARA"} →
        </Link>
      </section>

      <Footer locale={locale} />
    </main>
  );
}