"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./restaurant-menu-reference.css";

import {
  collection,
  getDocs,
  onSnapshot,
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
      "title": "Cold Starters",
      "items": [
        {
          "name": "La Lara Meze Selection",
          "price": "590",
          "description": "A trio of Turkish favourites: Spicy Ezme, Haydari and Atom."
        },
        {
          "name": "Spicy Ezme",
          "price": "390",
          "description": "Turkish tomato and red pepper salsa"
        },
        {
          "name": "Haydari",
          "price": "390",
          "description": "Thick yoghurt dip with white cheese, garlic and mint"
        },
        {
          "name": "Hummus",
          "price": "450",
          "description": "Served with toasted bread and vegetable sticks"
        },
        {
          "name": "Atom",
          "price": "420",
          "description": "Creamy yoghurt dip with dried chillis and chilli oil"
        }
      ]
    },
    {
      "title": "Hot Starters",
      "items": [
        {
          "name": "Falafel",
          "price": "550",
          "description": "Served with tahini yoghurt and fresh rocket"
        },
        {
          "name": "Marinated Artichoke",
          "price": "590",
          "description": "Grilled marinated artichoke served with tahini yoghurt"
        },
        {
          "name": "Mini Lahmacun",
          "price": "650",
          "description": "Three mini beef lahmacun served with fresh rocket, parsley and lemon wedges"
        },
        {
          "name": "Fried Calamari Rings",
          "price": "830",
          "description": "Served with tartare sauce and fresh rocket"
        },
        {
          "name": "Crispy Chicken Bites",
          "price": "790",
          "description": "Served with sweet chilli and Cheddar sauces"
        }
      ]
    },
    {
      "title": "Soup",
      "items": [
        {
          "name": "Lentil Soup",
          "price": "390",
          "description": "Served with spices and lemon wedges"
        },
        {
          "name": "Spicy Tomato Soup",
          "price": "420",
          "description": "Served with parmesan and croutons"
        }
      ]
    },
    {
      "title": "Salads",
      "items": [
        {
          "name": "Caesar Salad",
          "price": "650",
          "description": "Lettuce, cherry tomatoes, boiled egg, croutons and Parmesan dressing",
          "extras": [
            "Add grilled chicken breast strips +300"
          ]
        },
        {
          "name": "Garden Salad",
          "price": "590",
          "description": "Fresh seasonal vegetables with a light vinaigrette"
        },
        {
          "name": "Greek Salad",
          "price": "870",
          "description": "Tomatoes, cucumbers, red onions, green bell peppers, Kalamata olives and white cheese"
        }
      ]
    },
    {
      "title": "Pizza",
      "items": [
        {
          "name": "Pizza Margherita",
          "price": "890",
          "description": "Mozzarella, tomato sauce and fresh basil"
        },
        {
          "name": "Pizza Capricciosa",
          "price": "950",
          "description": "Mozzarella, tomato sauce, marinated artichokes, beef ham and olives"
        }
      ]
    },
    {
      "title": "Burger",
      "items": [
        {
          "name": "Lamburghini Burger",
          "price": "1100",
          "description": "Lamb Patty with Ezine cheese, sun-dried tomatoes and fresh rocket, served with fries"
        },
        {
          "name": "Mini Burger Trio",
          "price": "1050",
          "description": "Three classic mini cheeseburgers, served with fries"
        }
      ]
    },
    {
      "title": "Pasta",
      "items": [
        {
          "name": "Spaghetti Pomodoro",
          "price": "730",
          "description": "With a tomato sauce and fresh basil"
        },
        {
          "name": "Bolognese Pappardelle",
          "price": "920",
          "description": "With ground beef in a Bolognese sauce"
        },
        {
          "name": "Salmon Tagliatelle",
          "price": "1050",
          "description": "With flaked salmon and cherry tomatoes in a creamy sauce"
        }
      ]
    },
    {
      "title": "From the Land",
      "items": [
        {
          "name": "Köfte",
          "price": "890",
          "description": "Turkish beef and lamb meatballs served with sumac onions, grilled vegetables, rice, fries and acuka"
        },
        {
          "name": "Chicken Skewer",
          "price": "690",
          "description": "Grilled marinated chicken chunks served with sumac onions, grilled vegetables, fries and acuka"
        },
        {
          "name": "Grilled Chicken",
          "price": "950",
          "description": "Grilled sous-vide chicken breast served with grilled vegetables"
        },
        {
          "name": "Çökertme Kebab",
          "price": "1250",
          "description": "Seared beef strips over crispy straw potatoes, topped with warm tomato sauce and yoghurt"
        },
        {
          "name": "Beef Cheek",
          "price": "1450",
          "description": "Slow-braised beef cheek served with creamy mashed potatoes"
        },
        {
          "name": "Beef Tenderloin",
          "price": "1950",
          "description": "Sous-vide beef tenderloin, cooked to your liking, served with roasted baby potatoes and pepper sauce"
        },
        {
          "name": "Lamb Chops",
          "price": "2290",
          "description": "Grilled lamb chops served with fries"
        },
        {
          "name": "Mixed Grill Serves Two",
          "price": "3590",
          "description": "Lamb chops, chicken skewers and grilled köfte served with sumac onions, grilled vegetables, fries, ketchup, mayonnaise and acuka"
        }
      ]
    },
    {
      "title": "From the Sea",
      "items": [
        {
          "name": "Grilled Salmon",
          "price": "1250",
          "description": "Seared salmon fillet complemented by sweet honey-glazed carrots"
        },
        {
          "name": "Jumbo Prawns",
          "price": "1150",
          "description": "Charred jumbo prawns, served with flame-grilled lime"
        },
        {
          "name": "Dorado",
          "price": "1550",
          "description": "Grilled whole dorado served with roasted baby potatoes and tzatziki"
        }
      ]
    },
    {
      "title": "Sides",
      "items": [
        {
          "name": "French Fries",
          "price": "380"
        },
        {
          "name": "Grilled Vegetables",
          "price": "380"
        },
        {
          "name": "Roasted Baby Potatoes",
          "price": "380"
        }
      ]
    },
    {
      "title": "Sauces",
      "items": [
        {
          "name": "Black Pepper Sauce",
          "price": "180"
        },
        {
          "name": "Roquefort Sauce",
          "price": "180"
        },
        {
          "name": "Tzatziki",
          "price": "180"
        },
        {
          "name": "Acuka",
          "price": "180"
        },
        {
          "name": "Mayonnaise & Ketchup",
          "price": "180"
        }
      ]
    },
    {
      "title": "Dessert",
      "items": [
        {
          "name": "Lara’s Pavlova",
          "price": "590",
          "description": "Delicate meringue with whipped cream and a raspberry sorbet centre"
        },
        {
          "name": "Black Forrest Brownie",
          "price": "520",
          "description": "Chocolate brownie topped with sour cherries and whipped cream"
        },
        {
          "name": "Apple Crumble",
          "price": "490",
          "description": "Spiced baked apple chunks with a buttery crumble"
        },
        {
          "name": "Fruit Plate",
          "price": "970",
          "description": "A selection of seasonal fruits, perfect for sharing"
        }
      ]
    }
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

    useEffect(() => {
  const savedLocale =
    localStorage.getItem("lalara-locale");

  const params =
    new URLSearchParams(window.location.search);

  const queryLocale =
    params.get("lang");

  const nextLocale: Locale =
    queryLocale === "tr" ||
    queryLocale === "en"
      ? queryLocale
      : savedLocale === "tr"
        ? "tr"
        : "en";

  setLocale(nextLocale);

  localStorage.setItem(
    "lalara-locale",
    nextLocale
  );
}, []);

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

  const [menuLoaded, setMenuLoaded] =
    useState(false);

  const isTR =
    locale === "tr";

  /* =========================================================
     FIRESTORE MENU
     ========================================================= */

  const [navLabels, setNavLabels] = useState<Record<"breakfast" | "food" | "drinks", Record<Locale, string>>>(() => ({
    breakfast: { en: "BREAKFAST", tr: "KAHVALTI" },
    food: { en: "LUNCH & DINNER", tr: "ÖĞLE & AKŞAM" },
    drinks: { en: "DRINKS", tr: "İÇECEKLER" },
  }));

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

        setNavLabels((previous) => {
          const next = { ...previous };
          settingsSnapshot.docs.forEach((entry) => {
            const key = entry.id as "breakfast" | "food" | "drinks";
            if (key !== "breakfast" && key !== "food" && key !== "drinks") return;
            const data = entry.data();
            next[key] = {
              en: typeof data.navLabelEN === "string" && data.navLabelEN.trim() ? data.navLabelEN : previous[key].en,
              tr: typeof data.navLabelTR === "string" && data.navLabelTR.trim() ? data.navLabelTR : previous[key].tr,
            };
          });
          return next;
        });

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

                contentLocale: data.contentLocale,
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
          return categories.filter(category => !category.contentLocale || category.contentLocale === targetLocale.toUpperCase()).map(
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
              "A REASON TO GATHER.",

            tr:
              settings.subtitleTR ||
              "BİR ARAYA GELMEK İÇİN BİR NEDEN.",
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
      } finally {
        setMenuLoaded(true);
      }
    }

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    let initialSnapshots = 0;

    const scheduleRefresh = () => {
      initialSnapshots += 1;

      // Ignore the initial snapshot from each listener. The first loadMenu()
      // call already reads the same three collections.
      if (initialSnapshots <= 3) return;

      if (refreshTimer) clearTimeout(refreshTimer);

      refreshTimer = setTimeout(() => {
        void loadMenu();
      }, 80);
    };

    void loadMenu();

    const unsubscribeCategories = onSnapshot(
      collection(db, "menuCategories"),
      scheduleRefresh,
      (error) => console.error("Food categories live listener error:", error)
    );

    const unsubscribeItems = onSnapshot(
      collection(db, "menuItems"),
      scheduleRefresh,
      (error) => console.error("Food items live listener error:", error)
    );

    const unsubscribeSettings = onSnapshot(
      collection(db, "menuSettings"),
      scheduleRefresh,
      (error) => console.error("Food settings live listener error:", error)
    );

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      unsubscribeCategories();
      unsubscribeItems();
      unsubscribeSettings();
    };
  }, []);

  /*
   * Firestore hazırsa CMS.
   * Değilse mevcut hardcoded menü.
   */
const sections = cmsReady
  ? firestoreSections[locale]
  : menu[locale];

  useEffect(() => {
    if (window.location.hash !== "#menu-heading") return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("menu-heading")?.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [locale, menuLoaded]);

  return (
    <main
      className="restaurant-menu-page"
      lang={locale === "tr" ? "tr" : "en"}
      style={{ visibility: menuLoaded ? "visible" : "hidden" }}
    >

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

      <nav id="menu-heading" className="restaurant-menu-tabs" aria-label="Menu navigation">
        <Link href={`/breakfast-menu?lang=${locale}#menu-heading`} className="">{navLabels.breakfast[locale]}</Link>
        <Link href={`/food-menu?lang=${locale}#menu-heading`} className="active">{navLabels.food[locale]}</Link>
        <Link href={`/drinks-menu?lang=${locale}#menu-heading`} className="">{navLabels.drinks[locale]}</Link>
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
        <h1>{menuTitle[locale]}</h1>
        <span>{menuSubtitle[locale]}</span>
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

      {/* BOTTOM MENU NAVIGATION */}
<nav className="restaurant-menu-tabs" aria-label="More menus">
        <Link href={`/breakfast-menu?lang=${locale}#menu-heading`} className="">{navLabels.breakfast[locale]}</Link>
        <Link href={`/food-menu?lang=${locale}#menu-heading`} className="active">{navLabels.food[locale]}</Link>
        <Link href={`/drinks-menu?lang=${locale}#menu-heading`} className="">{navLabels.drinks[locale]}</Link>
      </nav>

      <Footer
        locale={locale}
      />
    </main>
  );
}