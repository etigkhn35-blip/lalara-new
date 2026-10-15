"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fallbackGallery = [
  "/images/home/1.jpg",
  "/images/home/2.jpg",
  "/images/home/3.jpg",
  "/images/home/4.jpg",
  "/images/home/5.jpg",
  "/images/home/6.jpg",
  "/images/home/7.jpg",
  "/images/home/8.jpg",
];

export default function GaleriPage() {
  const [gallery, setGallery] = useState<string[]>(fallbackGallery);

  useEffect(() => {
    async function loadGallery() {
      try {
        const mediaSnapshot = await getDoc(
          doc(db, "siteSettings", "media")
        );

        const data = mediaSnapshot.data();

        if (!data) return;

        const uploadedGallery = Array.isArray(data.gallery)
          ? data.gallery
              .map((item: { url?: string }) => item?.url)
              .filter(
                (url: string | undefined): url is string =>
                  Boolean(url)
              )
          : [];

        const mediaImages = data.images || {};

        const cmsImages = [
          mediaImages.hero?.url,
          mediaImages.atmosphere?.url,
          mediaImages.food?.url,
          mediaImages.drinks?.url,
          mediaImages.breakfast?.url,
          mediaImages.sunset?.url,
          mediaImages.story?.url,
          mediaImages.moments?.url,
          mediaImages.event1?.url,
          mediaImages.event2?.url,
          mediaImages.event3?.url,
        ].filter(
          (url: string | undefined): url is string => Boolean(url)
        );

        const combined = Array.from(
          new Set([...uploadedGallery, ...cmsImages])
        );

        if (combined.length > 0) {
          setGallery(combined);
        }
      } catch (error) {
        console.error("Galeri yükleme hatası:", error);
      }
    }

    loadGallery();
  }, []);

  return (
    <main className="gallery-page">
      {/* HEADER */}
      <Header locale="tr" />

      {/* HERO */}
     <section className="gallery-page-hero">
  <Image
    src="/images/home/6.jpg"
    alt="La Lara Restaurant & Bar Yalıkavak galeri"
    fill
    priority
    sizes="100vw"
    className="cover"
  />

  <div className="image-overlay" />

  <div className="gallery-page-hero-content">
    <p className="eyebrow light">La Lara · Yalıkavak</p>

    <h1>
      La Lara&apos;dan
      <br />
      Anlar
    </h1>

    <p>
      Sakin sabahlardan gün batımı sofralarına ve Yalıkavak
      Körfezi&apos;ne karşı uzayan akşamlara.
    </p>
  </div>
</section>

      {/* GALLERY */}
      <section className="gallery-page-grid">
        {gallery.map((src, index) => (
          <figure
            className={`gallery-page-item gallery-page-item-${
              (index % 6) + 1
            }`}
            key={`${src}-${index}`}
          >
            <Image
              src={src}
              alt={`La Lara Restaurant & Bar Yalıkavak ${
                index + 1
              }`}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 40vw"
              className="cover"
            />
          </figure>
        ))}
      </section>

      {/* CTA */}
      <section className="gallery-page-cta">
        <p className="eyebrow">Masanız Sizi Bekliyor</p>

        <h2>
          La Lara&apos;yı
          <br />
          deneyimleyin.
        </h2>

        <div className="gallery-page-actions">
          <Link href="/tr#menus" className="line-link">
            MENÜLERİMİZİ GÖRÜN <span>→</span>
          </Link>

          <a
            href={
              "https://wa.me/905458941838?text=" +
              encodeURIComponent(
                "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:"
              )
            }
            target="_blank"
            rel="noopener noreferrer"
            className="outline-button gallery-dark-button"
          >
            REZERVASYON TALEBİ
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <Footer locale="tr" />
    </main>
  );
}