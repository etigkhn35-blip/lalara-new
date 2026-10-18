"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";

type Locale = "tr" | "en";

type MenuItem = {
  id?: string;
  name: string;
  description?: string;
  price: string;
  extras?: string[];
  order?: number;
};

type MenuSection = {
  id?: string;
  title: string;
  items: MenuItem[];
  order?: number;
};

/* =========================================================
   FALLBACK MENU
   Firestore unavailable/empty olursa mevcut menü çalışır.
   ========================================================= */

export const menu: Record<Locale, MenuSection[]> = {
  tr: [
    {
      title: "Başlangıçlar",
      items: [
        {
          name: "Falafel",
          description: "yoğurtlu tahin sos",
          price: "550",
        },
        {
          name: "Mini Lahmacun",
          description:
            "üç adet mini dana lahmacun, roka, maydanoz ve limon",
          price: "650",
        },
        {
          name: "Humus",
          description: "nachos, sebze çubukları",
          price: "450",
        },
        {
          name: "Çıtır Tavuk Lokmaları",
          description: "sweet chili sos, cheddar sos",
          price: "790",
        },
        {
          name: "Kızarmış Kalamar",
          description: "tartar sos, roka salatası",
          price: "830",
        },
      ],
    },

    {
      title: "Çorbalar",
      items: [
        {
          name: "Acılı Domates Çorbası",
          description: "kruton, parmesan",
          price: "420",
        },
        {
          name: "Mercimek Çorbası",
          description: "baharat karışımı, limon",
          price: "390",
        },
      ],
    },

    {
      title: "Pizza & Burgerler",
      items: [
        {
          name: "Pizza Margherita",
          description:
            "mozzarella, domates sosu, fesleğen",
          price: "890",
        },
        {
          name: "Pizza Capricciosa",
          description:
            "dana jambon, enginar, zeytin",
          price: "950",
        },
        {
          name: "Steak Sandwich",
          description:
            "dana bonfile, marul, soğan, sarımsaklı mayonez",
          price: "1200",
        },
        {
          name: "Lamburghini Burger",
          description:
            "kuzu köftesi, Ezine peyniri, kuru domates, roka, patates kızartması",
          price: "1100",
        },
        {
          name: "Mini Burger Trio",
          description:
            "üç mini cheeseburger, patates kızartması",
          price: "1050",
        },
      ],
    },

    {
      title: "Salatalar",
      items: [
        {
          name: "Yunan Salatası",
          description:
            "domates, salatalık, yeşil biber, Ezine peyniri, zeytin, soğan",
          price: "870",
        },
        {
          name: "Bahçe Salatası",
          description:
            "karışık yeşillikler, mevsim sebzeleri, avokado, çekirdek karışımı",
          price: "720",
        },
        {
          name: "Deniz Ürünleri Salatası",
          description:
            "kalamar, ahtapot, karides, patates, karışık yeşillikler, domates, soğan",
          price: "1290",
        },
        {
          name: "Deniz Tarağı Salatası",
          description:
            "deniz tarağı, karışık yeşillikler, çilek, portakal",
          price: "1450",
        },
        {
          name: "Sezar Salatası",
          price: "690",
          extras: [
            "+ tavuk 300",
            "+ karides 350",
          ],
        },
      ],
    },

    {
      title: "Makarna",
      items: [
        {
          name: "Spaghetti Pomodoro",
          description:
            "domates sosu, fesleğen, parmesan",
          price: "730",
        },
        {
          name: "Salmon Tagliatelle",
          description:
            "somon, çeri domates, kremalı sos",
          price: "1050",
        },
        {
          name: "Bolognese Pappardelle",
          description:
            "dana kıyma, Bolonez sos, parmesan",
          price: "920",
        },
      ],
    },

    {
      title: "Yan Lezzetler",
      items: [
        {
          name: "Yan Lezzetler",
          description:
            "Baby patates · Patates kızartması · Izgara sebzeler",
          price: "380",
        },
      ],
    },

    {
      title: "Soslar",
      items: [
        {
          name: "Soslar",
          description:
            "Karabiber · Acuka · Cacık · Rokfor · Mayonez & Ketçap",
          price: "180",
        },
      ],
    },

    {
      title: "Denizden",
      items: [
        {
          name: "Dorado",
          description:
            "bütün dorado, baby patates, cacık",
          price: "1550",
        },
        {
          name: "Izgara Somon",
          description:
            "somon fileto, ballı glazeli havuç",
          price: "1250",
        },
        {
          name: "Jumbo Karides",
          description:
            "ızgara jumbo karides, alevde lime",
          price: "1150",
        },
      ],
    },

    {
      title: "Izgaralar",
      items: [
        {
          name: "Kuzu Pirzola",
          description: "patates kızartması",
          price: "2290",
        },
        {
          name: "Dana Bonfile",
          description: "baby patates",
          price: "1950",
        },
        {
          name: "Beef Stroganoff",
          description:
            "dana şeritleri, kremalı soğan sosu, patates püresi, kornişon turşu",
          price: "1290",
        },
        {
          name: "Tavuk Izgara",
          description: "ızgara sebzeler",
          price: "950",
        },
      ],
    },

    {
      title: "Tatlı",
      items: [
        {
          name: "Lara'nın Pavlovası",
          description:
            "beze, çırpılmış krema, ahududu",
          price: "590",
        },
        {
          name: "Panna Cotta",
          price: "450",
        },
        {
          name: "Cheesecake",
          description: "meyve püresi",
          price: "490",
        },
        {
          name: "Meyve Tabağı",
          description: "mevsim meyveleri",
          price: "970",
        },
        {
          name: "Dondurma & Sorbe",
          description:
            "Dilediğiniz aromayı seçin: dondurma vanilya · çikolata · sorbe limon · ahududu",
          price: "230",
        },
      ],
    },
  ],

  en: [
    {
      title: "Starters",
      items: [
        {
          name: "Falafel",
          description: "yoghurt tahini dip",
          price: "550",
        },
        {
          name: "Mini Lahmacun",
          description:
            "three mini beef lahmacun, rocket, fresh parsley, lemon",
          price: "650",
        },
        {
          name: "Hummus",
          description:
            "nachos, vegetable sticks",
          price: "450",
        },
        {
          name: "Crispy Chicken Bites",
          description:
            "sweet chili sauce, cheddar sauce",
          price: "790",
        },
        {
          name: "Fried Calamari Rings",
          description:
            "tartar sauce, rocket salad",
          price: "830",
        },
      ],
    },

    {
      title: "Soups",
      items: [
        {
          name: "Spicy Tomato Soup",
          description:
            "parmesan, croutons",
          price: "420",
        },
        {
          name: "Lentil Soup",
          description:
            "spices mix, lemon",
          price: "390",
        },
      ],
    },

    {
      title: "Pizza & Burgers",
      items: [
        {
          name: "Pizza Margherita",
          description:
            "mozzarella, tomato sauce, basil",
          price: "890",
        },
        {
          name: "Pizza Capricciosa",
          description:
            "beef ham, artichoke, olives",
          price: "950",
        },
        {
          name: "Steak Sandwich",
          description:
            "beef tenderloin, lettuce, onion, garlic mayonnaise",
          price: "1200",
        },
        {
          name: "Lamburghini Burger",
          description:
            "lamb patty, Ezine cheese, sun-dried tomatoes, rocket, fries",
          price: "1100",
        },
        {
          name: "Mini Burger Trio",
          description:
            "three mini cheeseburgers, fries",
          price: "1050",
        },
      ],
    },

    {
      title: "Salads",
      items: [
        {
          name: "Greek Salad",
          description:
            "tomato, cucumber, green pepper, Ezine cheese, olives, onion",
          price: "870",
        },
        {
          name: "Garden Salad",
          description:
            "mixed greens, seasonal vegetables, avocado, seed mix",
          price: "720",
        },
        {
          name: "Seafood Salad",
          description:
            "calamari, octopus, shrimps, potato, mixed greens, tomato, onion",
          price: "1290",
        },
        {
          name: "Scallops Salad",
          description:
            "scallops, mixed greens, tomato, strawberry, orange",
          price: "1450",
        },
        {
          name: "Caesar Salad",
          price: "690",
          extras: [
            "+ chicken 300",
            "+ shrimps 350",
          ],
        },
      ],
    },

    {
      title: "Pasta",
      items: [
        {
          name: "Spaghetti Pomodoro",
          description:
            "tomato sauce, basil, parmesan",
          price: "730",
        },
        {
          name: "Salmon Tagliatelle",
          description:
            "salmon, cherry tomatoes, creamy sauce",
          price: "1050",
        },
        {
          name: "Bolognese Pappardelle",
          description:
            "ground beef, Bolognese sauce, parmesan",
          price: "920",
        },
      ],
    },

    {
      title: "Sides",
      items: [
        {
          name: "Sides",
          description:
            "Baby potatoes · French fries · Grilled vegetables",
          price: "380",
        },
      ],
    },

    {
      title: "Sauces",
      items: [
        {
          name: "Sauces",
          description:
            "Black pepper · Acuka · Tzatziki · Roquefort · Mayonnaise & Ketchup",
          price: "180",
        },
      ],
    },

    {
      title: "From the Sea",
      items: [
        {
          name: "Dorado",
          description:
            "whole dorado, baby potatoes, tzatziki",
          price: "1550",
        },
        {
          name: "Grilled Salmon",
          description:
            "salmon fillet, honey-glazed carrots",
          price: "1250",
        },
        {
          name: "Jumbo Shrimps",
          description:
            "grilled jumbo shrimps, flamed lime",
          price: "1150",
        },
      ],
    },

    {
      title: "From the Land",
      items: [
        {
          name: "Lamb Chops",
          description: "french fries",
          price: "2290",
        },
        {
          name: "Beef Tenderloin",
          description: "baby potatoes",
          price: "1950",
        },
        {
          name: "Beef Stroganoff",
          description:
            "beef strips, creamy onion sauce, potato purée, pickled cucumbers",
          price: "1290",
        },
        {
          name: "Grilled Chicken",
          description:
            "grilled vegetables",
          price: "950",
        },
      ],
    },

    {
      title: "Dessert",
      items: [
        {
          name: "Lara's Pavlova",
          description:
            "meringue, whipped cream, raspberry",
          price: "590",
        },
        {
          name: "Panna Cotta",
          price: "450",
        },
        {
          name: "Cheesecake",
          description: "fruit purée",
          price: "490",
        },
        {
          name: "Fruit Plate",
          description:
            "seasonal fruits",
          price: "970",
        },
        {
          name: "Ice Cream & Sorbet",
          description:
            "Choose your flavour: ice cream vanilla · chocolate · sorbet lemon · raspberry",
          price: "230",
        },
      ],
    },
  ],
};

/* =========================================================
   PAGE
   ========================================================= */

export type FoodInitialSettings = {
  titleEN: string;
  titleTR: string;
  subtitleEN: string;
  subtitleTR: string;
};

type FoodMenuContentProps = {
  heroImage: string;
  initialSettings: FoodInitialSettings;
};

export default function FoodMenuContent({
  heroImage,
  initialSettings,
}: FoodMenuContentProps) {
  const [locale, setLocale] =
    useState<Locale>("en");

  const [firestoreSections, setFirestoreSections] =
    useState<Record<Locale, MenuSection[]>>({
      en: [],
      tr: [],
    });

  const [menuTitle, setMenuTitle] =
    useState<Record<Locale, string>>({
      en: initialSettings.titleEN,
      tr: initialSettings.titleTR,
    });

  const [menuSubtitle, setMenuSubtitle] =
    useState<Record<Locale, string>>({
      en: initialSettings.subtitleEN,
      tr: initialSettings.subtitleTR,
    });

  const [cmsReady, setCmsReady] =
    useState(false);

  const isTR =
    locale === "tr";

  /* =========================================================
     FIRESTORE MENU
     ========================================================= */

  useEffect(() => {
    async function loadMenu() {
      try {
        const [
          categorySnapshot,
          itemSnapshot,
          settingsSnapshot,
        ] = await Promise.all([
          getDocs(
            collection(
              db,
              "menuCategories"
            )
          ),

          getDocs(
            collection(
              db,
              "menuItems"
            )
          ),

          getDocs(
            collection(
              db,
              "menuSettings"
            )
          ),
        ]);

        const categories =
          categorySnapshot.docs
            .map((document) => {
              const data =
                document.data();

              return {
                id:
                  document.id,

                menu:
                  data.menu,

                nameEN:
                  data.nameEN || "",

                nameTR:
                  data.nameTR || "",

                order:
                  data.order ?? 0,

                visible:
                  data.visible !==
                  false,
              };
            })
            .filter(
              (category) =>
                category.menu ===
                  "food" &&
                category.visible
            )
            .sort(
              (a, b) =>
                a.order -
                b.order
            );

        const allItems =
          itemSnapshot.docs
            .map((document) => {
              const data =
                document.data();

              return {
                id:
                  document.id,

                menu:
                  data.menu,

                categoryId:
                  data.categoryId ||
                  "",

                nameEN:
                  data.nameEN || "",

                nameTR:
                  data.nameTR || "",

                descriptionEN:
                  data.descriptionEN ||
                  "",

                descriptionTR:
                  data.descriptionTR ||
                  "",

                price:
                  data.price || "",

                extrasEN:
                  Array.isArray(
                    data.extrasEN
                  )
                    ? data.extrasEN
                    : [],

                extrasTR:
                  Array.isArray(
                    data.extrasTR
                  )
                    ? data.extrasTR
                    : [],

                order:
                  data.order ?? 0,

                visible:
                  data.visible !==
                  false,
              };
            })
            .filter(
              (item) =>
                item.menu ===
                  "food" &&
                item.visible
            );

        const buildSections = (
          targetLocale: Locale
        ): MenuSection[] => {
          return categories.map(
            (category) => {
              const categoryItems =
                allItems
                  .filter(
                    (item) =>
                      item.categoryId ===
                      category.id
                  )
                  .sort(
                    (a, b) =>
                      a.order -
                      b.order
                  )
                  .map(
                    (item) => ({
                      id:
                        item.id,

                      name:
                        targetLocale ===
                        "en"
                          ? item.nameEN ||
                            item.nameTR
                          : item.nameTR ||
                            item.nameEN,

                      description:
                        targetLocale ===
                        "en"
                          ? item.descriptionEN ||
                            undefined
                          : item.descriptionTR ||
                            undefined,

                      price:
                        item.price,

                      extras:
                        targetLocale ===
                        "en"
                          ? item.extrasEN
                          : item.extrasTR,

                      order:
                        item.order,
                    })
                  );

              return {
                id:
                  category.id,

                title:
                  targetLocale ===
                  "en"
                    ? category.nameEN ||
                      category.nameTR
                    : category.nameTR ||
                      category.nameEN,

                items:
                  categoryItems,

                order:
                  category.order,
              };
            }
          );
        };

        const foodSettings =
          settingsSnapshot.docs.find(
            (document) =>
              document.id ===
              "food"
          );

        if (foodSettings) {
          const settings =
            foodSettings.data();

          setMenuTitle({
            en:
              settings.titleEN ||
              "Food Menu",

            tr:
              settings.titleTR ||
              "Yemek Menüsü",
          });

          setMenuSubtitle({
            en:
              settings.subtitleEN ||
              "Restaurant & Bar",

            tr:
              settings.subtitleTR ||
              "Restaurant & Bar",
          });
        }

        /*
         * Firestore'da en az bir Food
         * kategorisi varsa CMS kaynağını
         * kullanıyoruz.
         */
        if (
          categories.length >
          0
        ) {
          setFirestoreSections({
            en:
              buildSections(
                "en"
              ),

            tr:
              buildSections(
                "tr"
              ),
          });

          setCmsReady(
            true
          );
        } else {
          setCmsReady(
            false
          );
        }
      } catch (error) {
        console.error(
          "Food menu could not be loaded from Firestore:",
          error
        );

        setCmsReady(
          false
        );
      }
    }

    void loadMenu();
  }, []);

  /*
   * Firestore hazırsa CMS.
   * Değilse mevcut hardcoded menü.
   */
  const sections =
    cmsReady
      ? firestoreSections[
          locale
        ]
      : menu[locale];

  return (
    <main className="restaurant-menu-page">

      {/* PHOTO HEADER */}

      <div
        className="restaurant-menu-header-bg"
        style={{
          backgroundImage: `url("${heroImage}")`,
        }}
      >
        <div className="restaurant-menu-header-overlay" />

        <Header
          locale={locale}
          onLocaleChange={
            setLocale
          }
        />
      </div>

      {/* FOOD / DRINKS / BREAKFAST */}

      <nav
        className="restaurant-menu-tabs"
        aria-label="Menu navigation"
      >
        <Link
          href={`/food-menu?lang=${locale}`}
          className="active"
        >
          {isTR
            ? "YEMEK"
            : "FOOD"}
        </Link>

        <Link
          href={`/drinks-menu?lang=${locale}`}
        >
          {isTR
            ? "İÇECEK"
            : "DRINKS"}
        </Link>

        <Link
          href={`/breakfast-menu?lang=${locale}`}
        >
          {isTR
            ? "KAHVALTI"
            : "BREAKFAST"}
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
          {menuTitle[
            locale
          ]}
        </h1>

        <span>
          {menuSubtitle[
            locale
          ]}
        </span>
      </section>

      {/* MENU */}

      <section className="restaurant-menu-grid">
        {sections.map(
          (section) => (
            <section
              className="restaurant-menu-section"
              key={
                section.id ||
                section.title
              }
            >
              <h2>
                {section.title}
              </h2>

              <div className="restaurant-menu-items">
                {section.items.map(
                  (item) => (
                    <article
                      className="restaurant-menu-item"
                      key={
                        item.id ||
                        `${section.title}-${item.name}`
                      }
                    >
                      <div className="restaurant-menu-item-main">
                        <h3>
                          {item.name}
                        </h3>

                        {item.price && (
                          <strong>
                            {
                              item.price
                            }
                          </strong>
                        )}
                      </div>

                      {item.description && (
                        <p>
                          {
                            item.description
                          }
                        </p>
                      )}

                      {item.extras?.map(
                        (
                          extra,
                          index
                        ) => (
                          <p
                            className="restaurant-menu-extra"
                            key={`${extra}-${index}`}
                          >
                            {
                              extra
                            }
                          </p>
                        )
                      )}
                    </article>
                  )
                )}
              </div>
            </section>
          )
        )}
      </section>

      {/* BOTTOM */}

      <section className="restaurant-menu-note">
        <p>
          {isTR
            ? "Lütfen sipariş vermeden önce alerjileriniz veya özel beslenme gereksinimleriniz hakkında ekibimizi bilgilendiriniz."
            : "Please inform our team of any allergies or dietary requirements before ordering."}
        </p>

        <Link
          href={
            isTR
              ? "/tr"
              : "/"
          }
        >
          {isTR
            ? "LA LARA'YA DÖN"
            : "BACK TO LA LARA"}{" "}
          →
        </Link>
      </section>

      <Footer
        locale={locale}
      />
    </main>
  );
}