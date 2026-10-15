"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Locale = "tr" | "en";

type MenuItem = {
  name: string;
  description?: string;
  price?: string;
  prices?: string[];
};

type MenuSection = {
  title: string;
  columns?: string[];
  items: MenuItem[];
  note?: string;
};

const menu: Record<Locale, MenuSection[]> = {
  tr: [
    {
      title: "Şampanya & Prosecco",
      columns: ["Kadeh", "Şişe"],
      items: [
        {
          name: "Kavaklıdere İnci Damlası",
          prices: ["630", "3100"],
        },
        {
          name: "Tallero Vino Frizzante Secco",
          prices: ["", "2900"],
        },
        {
          name: "Mor Salkım Roze Bargilya",
          prices: ["", "5400"],
        },
        {
          name: "Ruffino Prosecco D.O.C",
          prices: ["", "6200"],
        },
        {
          name: "Moët & Chandon Impérial Brut",
          prices: ["", "15000"],
        },
      ],
    },
    {
      title: "Beyaz",
      columns: ["Kadeh", "Şişe"],
      items: [
        {
          name: "Vinkara Atelier Hasandede",
          prices: ["750", "2900"],
        },
        {
          name: "Vinkara Sauvignon Blanc",
          prices: ["", "3100"],
        },
        {
          name: "Mor Salkım Fumé Blanc-Chardonnay",
          prices: ["", "3600"],
        },
        {
          name: "Sarafin Sauvignon Blanc",
          prices: ["", "4100"],
        },
        {
          name: "Sarafin Chardonnay",
          prices: ["", "4200"],
        },
      ],
    },
    {
      title: "Roze",
      columns: ["Kadeh", "Şişe"],
      items: [
        {
          name: "Vinkara Minoj Kalecik Karası",
          prices: ["750", "2900"],
        },
      ],
    },
    {
      title: "Kırmızı",
      columns: ["Kadeh", "Şişe"],
      items: [
        {
          name: "Vinkara Syrah",
          prices: ["830", "3200"],
        },
        {
          name: "Vinkara Cabernet Sauvignon",
          prices: ["", "3100"],
        },
        {
          name: "Pamukkale Artı Cab. Sauvignon Merlot",
          prices: ["", "3500"],
        },
        {
          name: "Sarafin Merlot",
          prices: ["", "4200"],
        },
      ],
    },
    {
      title: "Porto Şarabı",
      columns: ["Kadeh"],
      items: [
        {
          name: "Portal Fine Tawny Porto",
          description:
            "Tinta Roriz, Tinta Barrocca, Touriga Nacional, Touriga Franca · 2020 Portugal",
          prices: ["550"],
        },
      ],
    },
    {
      title: "Yarım Şişeler · 37,5 cl",
      columns: ["Şişe"],
      items: [
        {
          name: "Senfoni Narince Chardonnay",
          description: "Beyaz",
          prices: ["1200"],
        },
        {
          name: "Senfoni Öküzgözü Shiraz",
          description: "Kırmızı",
          prices: ["1200"],
        },
        {
          name: "Senfoni Öküzgözü",
          description: "Roze",
          prices: ["1200"],
        },
      ],
    },

    {
      title: "Klasik Kokteyller",
      items: [
        {
          name: "Mojito",
          description: "Rom, lime suyu, esmer şeker, nane, soda",
          price: "900",
        },
        {
          name: "Margarita",
          description: "Tekila, portakal likörü, lime suyu",
          price: "900",
        },
        {
          name: "Moscow Mule",
          description: "Votka, lime suyu, ginger ale, nane",
          price: "900",
        },
        {
          name: "Whiskey Sour",
          description: "Viski, limon suyu, şeker şurubu",
          price: "950",
        },
        {
          name: "Vodka Soda",
          description: "Votka, limon suyu, soda",
          price: "850",
        },
        {
          name: "Vodka Martini",
          description: "Vodka, Dry Martini, zeytin",
          price: "900",
        },
        {
          name: "Gin & Tonic",
          description: "Cin, tonik, lime dilimi",
          price: "850",
        },
      ],
    },
    {
      title: "Spritz Kokteylleri",
      items: [
        {
          name: "Rosé Spritz",
          description: "Roze şarap, soda, lime suyu, nane",
          price: "800",
        },
        {
          name: "Aperol Spritz",
          description: "Aperol, köpüklü şarap, soda, portakal suyu",
          price: "900",
        },
        {
          name: "Limoncello Spritz",
          description: "Limoncello, köpüklü şarap, soda, limon dilimi",
          price: "900",
        },
        {
          name: "Hugo Spritz",
          description:
            "Köpüklü şarap, soda, mürver çiçeği likörü, lime dilimi, nane",
          price: "850",
        },
        {
          name: "La Lara Mimosa",
          description:
            "Köpüklü şarap, portakal suyu, mürver çiçeği likörü",
          price: "700",
        },
      ],
    },
    {
      title: "İmza Kokteyller",
      items: [
        {
          name: "Gin Basil Smash",
          description: "Cin, limon suyu, şeker şurubu, fesleğen",
          price: "990",
        },
        {
          name: "Espresso Martini",
          description: "Votka, kahve likörü, espresso",
          price: "950",
        },
        {
          name: "Strawberry Daiquiri",
          description:
            "Beyaz rom, çilek püresi, limon suyu, şeker şurubu",
          price: "950",
        },
        {
          name: "Mai Tai",
          description:
            "Koyu rom, badem likörü, lime suyu, şeker şurubu",
          price: "990",
        },
        {
          name: "Negroni",
          description: "Campari, Martini Rosso, cin, portakal kabuğu",
          price: "950",
        },
        {
          name: "Painkiller",
          description: "Beyaz rom, Malibu, portakal suyu, ananas suyu",
          price: "900",
        },
      ],
    },
    {
      title: "Alkolsüz Kokteyller",
      items: [
        {
          name: "Virgin Mojito",
          description: "Lime suyu, şeker şurubu, nane, Sprite",
          price: "650",
        },
        {
          name: "Pineapple Ipanema",
          description: "Ananas suyu, şeker şurubu, ginger ale, lime, mint",
          price: "650",
        },
        {
          name: "Mint Berry Smash",
          description:
            "Donmuş Orman Meyveleri, limon suyu, nane, şeker şurubu, soda",
          price: "650",
        },
      ],
    },
    {
      title: "Bira",
      items: [
        { name: "Efes Pilsen 33 cl", price: "380" },
        { name: "Bomonti 50 cl", price: "490" },
        { name: "Tuborg 30 cl / 50 cl", price: "380 / 480" },
        { name: "Corona 35,5 cl", price: "520" },
      ],
    },

    {
      title: "Viski",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Jameson", prices: ["530", "790"] },
        { name: "Jameson Black Barrel", prices: ["560", "840"] },
        { name: "Jack Daniel's No.7", prices: ["540", "810"] },
        { name: "Johnnie Walker Black Label", prices: ["550", "820"] },
        { name: "Chivas Regal 12", prices: ["590", "880"] },
        { name: "Glenlivet Founder's Reserve", prices: ["610", "910"] },
        { name: "Woodford Reserve Bourbon", prices: ["680", "1020"] },
      ],
    },
    {
      title: "Votka",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Absolut", prices: ["470", "710"] },
        { name: "Absolut Elyx", prices: ["650", "970"] },
        { name: "Stolichnaya Elit", prices: ["950", "1420"] },
        { name: "Grey Goose", prices: ["830", "1240"] },
        { name: "Ketel One", prices: ["580", "870"] },
        { name: "Kauffman", prices: ["800", "1200"] },
      ],
    },
    {
      title: "Cin",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Gordon's", prices: ["410", "610"] },
        { name: "Beefeater", prices: ["450", "670"] },
        { name: "Tanqueray", prices: ["550", "820"] },
        { name: "Tanqueray No.10", prices: ["780", "1170"] },
      ],
    },
    {
      title: "Rom",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Diplomático Ron Antiguo", prices: ["730", "1050"] },
        { name: "Bacardi Black", prices: ["590", "880"] },
        { name: "Bacardi Blanco", prices: ["520", "780"] },
        { name: "Captain Morgan Gold", prices: ["470", "710"] },
        { name: "Captain Morgan White", prices: ["470", "710"] },
      ],
    },
    {
      title: "Tekila",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Olmeca Silver", prices: ["470", "710"] },
        { name: "Olmeca Gold", prices: ["520", "780"] },
        { name: "Olmeca Alto", prices: ["590", "880"] },
        { name: "Patrón Añejo", prices: ["1260", "1850"] },
      ],
    },
    {
      title: "Konyak",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Armagnac", prices: ["480", "720"] },
        { name: "Martell V.S", prices: ["680", "1010"] },
        { name: "Hennessy V.S.O.P", prices: ["790", "1180"] },
        { name: "Remy Martin V.S.O.P", prices: ["830", "1240"] },
        { name: "Martell V.S.O.P", prices: ["890", "1330"] },
      ],
    },
    {
      title: "Rakı",
      columns: ["4 cl", "8 cl", "35 cl", "70 cl"],
      items: [
        {
          name: "Yeni Rakı",
          prices: ["370", "550", "1860", "4080"],
        },
        {
          name: "Beylerbeyi Göbek",
          prices: ["460", "690", "2340", "4560"],
        },
        {
          name: "Tekirdağ",
          prices: ["380", "570", "", ""],
        },
      ],
    },
    {
      title: "Vermut",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Martini Bianco", prices: ["470", "710"] },
        { name: "Martini Rosso", prices: ["470", "710"] },
        { name: "Martini Extra Dry", prices: ["470", "710"] },
      ],
    },
    {
      title: "Likörler",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Jägermeister", prices: ["470", "710"] },
        { name: "Limoncello", prices: ["470", "710"] },
        { name: "Sambuca", prices: ["470", "710"] },
        { name: "Bailey's", prices: ["470", "710"] },
        { name: "Campari", prices: ["470", "710"] },
        { name: "Luxardo Maraschino", prices: ["470", "710"] },
        { name: "St. Germain", prices: ["470", "710"] },
        { name: "Drambuie", prices: ["470", "710"] },
      ],
    },
    {
      title: "Cachaça",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Janeiro", prices: ["470", "710"] },
        { name: "Mangaroca", prices: ["520", "780"] },
      ],
      note: "*Şişe fiyatları için lütfen ekibimize danışınız.",
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
          price: "+40",
        },
        {
          name: "Süt Alternatifleri",
          description: "hindistan cevizi · badem · yulaf",
          price: "+50",
        },
      ],
    },
    {
      title: "Soğuk Kahveler",
      items: [
        { name: "Americano", price: "260" },
        { name: "Latte", price: "320" },
        { name: "Vanilya Latte", price: "360" },
        { name: "Karamel Latte", price: "360" },
      ],
    },
    {
      title: "Tea",
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
      title: "Meşrubatlar",
      items: [
        { name: "Cola · Sprite · Fanta", price: "210" },
        { name: "Ice Tea", price: "210" },
        { name: "Ginger Ale", price: "250" },
        { name: "Tonic", price: "250" },
        { name: "Redbull", price: "290" },
        {
          name: "Meyve Suyu",
          description: "vişne · elma · ananas",
          price: "210",
        },
      ],
    },
    {
      title: "Taze Meyve Suları",
      items: [
        {
          name: "Taze Sıkılmış Meyve Suları",
          description: "portakal · elma · havuç",
          price: "390",
        },
        {
          name: "Yeşil Detoks Suyu",
          description: "apple, cucumber, celery, lemon",
          price: "430",
        },
        {
          name: "Lemon Spritz",
          description: "limon suyu, nane, şeker şurubu, soda",
          price: "340",
        },
      ],
    },
    {
      title: "Sular",
      items: [
        { name: "Su 700 ml", price: "170" },
        { name: "Şişe Su 400 ml / 1 l", price: "130 / 240" },
        { name: "Maden Suyu 250 ml / 750 ml", price: "150 / 290" },
      ],
    },
  ],

  en: [
    {
      title: "Champagne & Prosecco",
      columns: ["Glass", "Bottle"],
      items: [
        { name: "Kavaklıdere İnci Damlası", prices: ["630", "3100"] },
        { name: "Tallero Vino Frizzante Secco", prices: ["", "2900"] },
        { name: "Mor Salkım Roze Bargilya", prices: ["", "5400"] },
        { name: "Ruffino Prosecco D.O.C", prices: ["", "6200"] },
        {
          name: "Moët & Chandon Impérial Brut",
          prices: ["", "15000"],
        },
      ],
    },
    {
      title: "White",
      columns: ["Glass", "Bottle"],
      items: [
        {
          name: "Vinkara Atelier Hasandede",
          prices: ["750", "2900"],
        },
        {
          name: "Vinkara Sauvignon Blanc",
          prices: ["", "3100"],
        },
        {
          name: "Mor Salkım Fumé Blanc-Chardonnay",
          prices: ["", "3600"],
        },
        {
          name: "Sarafin Sauvignon Blanc",
          prices: ["", "4100"],
        },
        { name: "Sarafin Chardonnay", prices: ["", "4200"] },
      ],
    },
    {
      title: "Rosé",
      columns: ["Glass", "Bottle"],
      items: [
        {
          name: "Vinkara Minoj Kalecik Karası",
          prices: ["750", "2900"],
        },
      ],
    },
    {
      title: "Red",
      columns: ["Glass", "Bottle"],
      items: [
        { name: "Vinkara Syrah", prices: ["830", "3200"] },
        {
          name: "Vinkara Cabernet Sauvignon",
          prices: ["", "3100"],
        },
        {
          name: "Pamukkale Artı Cab. Sauvignon Merlot",
          prices: ["", "3500"],
        },
        { name: "Sarafin Merlot", prices: ["", "4200"] },
      ],
    },
    {
      title: "Port Wine",
      columns: ["Glass"],
      items: [
        {
          name: "Portal Fine Tawny Porto",
          description:
            "Tinta Roriz, Tinta Barrocca, Touriga Nacional, Touriga Franca · 2020 Portugal",
          prices: ["550"],
        },
      ],
    },
    {
      title: "Half Bottles · 37,5 l",
      columns: ["Bottle"],
      items: [
        {
          name: "Senfoni Narince Chardonnay",
          description: "White",
          prices: ["1200"],
        },
        {
          name: "Senfoni Öküzgözü Shiraz",
          description: "Red",
          prices: ["1200"],
        },
        {
          name: "Senfoni Öküzgözü",
          description: "Rosé",
          prices: ["1200"],
        },
      ],
    },

    {
      title: "Classic Cocktails",
      items: [
        {
          name: "Mojito",
          description: "Rum, lime juice, brown sugar, mint, soda",
          price: "900",
        },
        {
          name: "Margarita",
          description: "Tequila, orange liqueur, lime juice",
          price: "900",
        },
        {
          name: "Moscow Mule",
          description: "Vodka, lime juice, Ginger Ale, mint",
          price: "900",
        },
        {
          name: "Whiskey Sour",
          description: "Whiskey, lemon juice, simple syrup",
          price: "950",
        },
        {
          name: "Vodka Soda",
          description: "Vodka, lemon juice, soda",
          price: "850",
        },
        {
          name: "Vodka Martini",
          description: "Vodka, Dry Martini, olives",
          price: "900",
        },
        {
          name: "Gin & Tonic",
          description: "Gin, tonic, lime",
          price: "850",
        },
      ],
    },
    {
      title: "Spritz Selection",
      items: [
        {
          name: "Rosé Spritz",
          description: "Rosé wine, soda, lime juice, mint",
          price: "800",
        },
        {
          name: "Aperol Spritz",
          description: "Aperol, sparkling wine, soda, orange slice",
          price: "900",
        },
        {
          name: "Limoncello Spritz",
          description: "Limoncello, sparkling wine, soda, lemon",
          price: "900",
        },
        {
          name: "Hugo Spritz",
          description:
            "Sparkling wine, elderflower liqueur, soda, lime, mint",
          price: "850",
        },
        {
          name: "La Lara Mimosa",
          description:
            "Sparkling wine, orange juice, elderflower liqueur",
          price: "700",
        },
      ],
    },
    {
      title: "Signatures & Modern Icons",
      items: [
        {
          name: "Gin Basil Smash",
          description: "Gin, lemon juice, simple syrup, basil",
          price: "990",
        },
        {
          name: "Espresso Martini",
          description: "Vodka, coffee liqueur, espresso",
          price: "950",
        },
        {
          name: "Strawberry Daiquiri",
          description:
            "White rum, strawberry purée, lemon juice, simple syrup",
          price: "950",
        },
        {
          name: "Mai Tai",
          description: "Dark rum, almond liqueur, lime juice, simple syrup",
          price: "990",
        },
        {
          name: "Negroni",
          description: "Campari, Martini Rosso, gin, orange zest",
          price: "950",
        },
        {
          name: "Painkiller",
          description: "White rum, Malibu, orange juice, pineapple juice",
          price: "900",
        },
      ],
    },
    {
      title: "Mocktails",
      items: [
        {
          name: "Virgin Mojito",
          description: "Lime juice, simple syrup, mint, Sprite",
          price: "650",
        },
        {
          name: "Pineapple Ipanema",
          description:
            "Pineapple juice, simple syrup, ginger ale, lime, mint",
          price: "650",
        },
        {
          name: "Mint Berry Smash",
          description: "Berries, lemon, mint, sugar syrup, soda",
          price: "650",
        },
      ],
    },
    {
      title: "Beer",
      items: [
        { name: "Efes Pilsen 33 cl", price: "380" },
        { name: "Bomonti 50 cl", price: "490" },
        { name: "Tuborg 30 cl / 50 cl", price: "380 / 480" },
        { name: "Corona 35,5 cl", price: "520" },
      ],
    },

    {
      title: "Whiskey",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Jameson", prices: ["530", "790"] },
        { name: "Jameson Black Barrel", prices: ["560", "840"] },
        { name: "Jack Daniel's No.7", prices: ["540", "810"] },
        { name: "Johnnie Walker Black Label", prices: ["550", "820"] },
        { name: "Chivas Regal 12", prices: ["590", "880"] },
        { name: "Glenlivet Founder's Reserve", prices: ["610", "910"] },
        { name: "Woodford Reserve Bourbon", prices: ["680", "1020"] },
      ],
    },
    {
      title: "Vodka",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Absolut", prices: ["470", "710"] },
        { name: "Absolut Elyx", prices: ["650", "970"] },
        { name: "Stolichnaya Elit", prices: ["950", "1420"] },
        { name: "Grey Goose", prices: ["830", "1240"] },
        { name: "Ketel One", prices: ["580", "870"] },
        { name: "Kauffman", prices: ["800", "1200"] },
      ],
    },
    {
      title: "Gin",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Gordon's", prices: ["410", "610"] },
        { name: "Beefeater", prices: ["450", "670"] },
        { name: "Tanqueray", prices: ["550", "820"] },
        { name: "Tanqueray No.10", prices: ["780", "1170"] },
      ],
    },
    {
      title: "Rum",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Diplomático Ron Antiguo", prices: ["730", "1050"] },
        { name: "Bacardi Black", prices: ["590", "880"] },
        { name: "Bacardi Blanco", prices: ["520", "780"] },
        { name: "Captain Morgan Gold", prices: ["470", "710"] },
        { name: "Captain Morgan White", prices: ["470", "710"] },
      ],
    },
    {
      title: "Tequila",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Olmeca Silver", prices: ["470", "710"] },
        { name: "Olmeca Gold", prices: ["520", "780"] },
        { name: "Olmeca Alto", prices: ["590", "880"] },
        { name: "Patrón Añejo", prices: ["1260", "1850"] },
      ],
    },
    {
      title: "Cognac",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Armagnac", prices: ["480", "720"] },
        { name: "Martell V.S", prices: ["680", "1010"] },
        { name: "Hennessy V.S.O.P", prices: ["790", "1180"] },
        { name: "Remy Martin V.S.O.P", prices: ["830", "1240"] },
        { name: "Martell V.S.O.P", prices: ["890", "1330"] },
      ],
    },
    {
      title: "Rakı",
      columns: ["4 cl", "8 cl", "35 cl", "70 cl"],
      items: [
        {
          name: "Yeni Rakı",
          prices: ["370", "550", "1860", "4080"],
        },
        {
          name: "Beylerbeyi Göbek",
          prices: ["460", "690", "2340", "4560"],
        },
        { name: "Tekirdağ", prices: ["380", "570", "", ""] },
      ],
    },
    {
      title: "Vermouth",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Martini Bianco", prices: ["470", "710"] },
        { name: "Martini Rosso", prices: ["470", "710"] },
        { name: "Martini Extra Dry", prices: ["470", "710"] },
      ],
    },
    {
      title: "Liqueurs",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Jägermeister", prices: ["470", "710"] },
        { name: "Limoncello", prices: ["470", "710"] },
        { name: "Sambuca", prices: ["470", "710"] },
        { name: "Bailey's", prices: ["470", "710"] },
        { name: "Campari", prices: ["470", "710"] },
        { name: "Luxardo Maraschino", prices: ["470", "710"] },
        { name: "St. Germain", prices: ["470", "710"] },
        { name: "Drambuie", prices: ["470", "710"] },
      ],
    },
    {
      title: "Cachaça",
      columns: ["4 cl", "8 cl"],
      items: [
        { name: "Janeiro", prices: ["470", "710"] },
        { name: "Mangaroca", prices: ["520", "780"] },
      ],
      note: "*Bottle prices available upon request.",
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
          name: "Add Syrup",
          description: "hazelnut · chocolate · almond · banana",
          price: "+40",
        },
        {
          name: "Milk Alternatives",
          description: "coconut · almond · oat",
          price: "+50",
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
      title: "Soft Drinks",
      items: [
        { name: "Cola · Sprite · Fanta", price: "210" },
        { name: "Ice Tea", price: "210" },
        { name: "Ginger Ale", price: "250" },
        { name: "Tonic", price: "250" },
        { name: "Redbull", price: "290" },
        {
          name: "Fruit Juice",
          description: "cherry · apple · pineapple",
          price: "210",
        },
      ],
    },
    {
      title: "Fresh Juices",
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
      ],
    },
    {
      title: "Water",
      items: [
        { name: "Water 700 ml", price: "170" },
        { name: "Bottled Water 400 ml / 1 l", price: "130 / 240" },
        {
          name: "Sparkling Water 250 ml / 750 ml",
          price: "150 / 290",
        },
      ],
    },
  ],
};


 export default function DrinksMenuPage() {
  const [locale, setLocale] = useState<Locale>("en");

  const isTR = locale === "tr";
  const sections = menu[locale];

  return (
    <main className="restaurant-menu-page">

      {/* PHOTO HEADER */}
      <div
        className="restaurant-menu-header-bg"
        style={{
          backgroundImage: "url('/images/home/2.jpg')",
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

        <Link href="/drinks-menu" className="active">
          {isTR ? "İÇECEK" : "DRINKS"}
        </Link>

        <Link href="/breakfast-menu">
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
          {isTR ? "İçecek Menüsü" : "Drinks Menu"}
        </h1>

        <span>Restaurant &amp; Bar</span>
      </section>

      {/* MENU */}
      <section className="restaurant-menu-grid">
        {sections.map((section) => (
          <section
            className="restaurant-menu-section"
            key={section.title}
          >
            <h2>{section.title}</h2>

            {section.columns && (
              <div
                className="restaurant-menu-price-head"
                style={{
                  gridTemplateColumns: `minmax(0, 1fr) repeat(${section.columns.length}, 55px)`,
                }}
              >
                <span />

                {section.columns.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
            )}

            <div className="restaurant-menu-items">
              {section.items.map((item, index) => (
                <article
                  className="restaurant-menu-item"
                  key={`${section.title}-${item.name}-${index}`}
                >
                  {item.prices ? (
                    <div
                      className="restaurant-menu-multi-price"
                      style={{
                        gridTemplateColumns: `minmax(0, 1fr) repeat(${item.prices.length}, 55px)`,
                      }}
                    >
                      <h3>{item.name}</h3>

                      {item.prices.map((price, priceIndex) => (
                        <strong key={priceIndex}>
                          {price || "—"}
                        </strong>
                      ))}
                    </div>
                  ) : (
                    <div className="restaurant-menu-item-main">
                      <h3>{item.name}</h3>

                      {item.price && (
                        <strong>{item.price}</strong>
                      )}
                    </div>
                  )}

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
            ? "Fiyatlar Türk Lirası'dır."
            : "Prices are in Turkish Lira."}
        </p>

        <Link href={isTR ? "/tr" : "/"}>
          {isTR ? "LA LARA'YA DÖN" : "BACK TO LA LARA"} →
        </Link>
      </section>

      <Footer locale={locale} />
    </main>
  );
}