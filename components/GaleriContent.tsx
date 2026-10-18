"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* =========================================================
   TYPES
   ========================================================= */

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;

  buttonLabel?: string;
  buttonLink?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;

  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

  visible?: boolean;
  status?: string;
};

export type GalleryMedia = {
  hero: string;
  photos: string[];
};

type GaleriContentProps = {
  initialMedia: GalleryMedia;
};

/* =========================================================
   HELPERS
   ========================================================= */

function renderLines(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

/* =========================================================
   PAGE
   ========================================================= */

export default function GaleriContent({
  initialMedia,
}: GaleriContentProps) {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const media = initialMedia;

  /* =======================================================
     LOAD CMS ONLY
     ======================================================= */

  useEffect(() => {
    async function loadContent() {
      try {
        const contentSnapshot =
          await getDocs(
            collection(
              db,
              "siteContent"
            )
          );

        const nextCms: Record<
          string,
          CmsRecord
        > = {};

        contentSnapshot.forEach(
          (item) => {
            const data =
              item.data() as CmsRecord;

            if (
              item.id.startsWith(
                "tr-"
              ) &&
              data.status ===
                "published"
            ) {
              nextCms[
                item.id.replace(
                  "tr-",
                  ""
                )
              ] = data;
            }
          }
        );

        setCms(nextCms);
      } catch (error) {
        console.error(
          "Galeri CMS yükleme hatası:",
          error
        );
      }
    }

    loadContent();
  }, []);

  /* =======================================================
     CMS HELPERS
     ======================================================= */

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return (
      cms[key]?.visible !== false
    );
  }

  function cmsStyle(
    key: string,
    kind:
      | "eyebrow"
      | "heading"
      | "text"
  ) {
    const item = cms[key];

    if (!item) {
      return undefined;
    }

    const size =
      kind === "eyebrow"
        ? item.eyebrowSize
        : kind === "heading"
          ? item.headingSize
          : item.textSize;

    return {
      ...(size
        ? {
            fontSize: `${size}px`,
          }
        : {}),

      ...(item.fontWeight
        ? {
            fontWeight:
              item.fontWeight,
          }
        : {}),

      ...(item.lineHeight
        ? {
            lineHeight:
              item.lineHeight,
          }
        : {}),

      ...(item.letterSpacing !==
      undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  /* =======================================================
     CMS CONTENT
     ======================================================= */

  const hero =
    content("gallery-hero");

  const cta =
    content("gallery-cta");

  /* =======================================================
     RESERVATION
     ======================================================= */

  const reservationHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:"
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="gallery-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header locale="tr" />

      {/* ===================================================
          HERO
          =================================================== */}

      {isVisible(
        "gallery-hero"
      ) &&
        media.hero && (
          <section
            className="gallery-page-hero"
            style={{
              background:
                "transparent",
            }}
          >
            <Image
              src={media.hero}
              alt="La Lara Restaurant & Bar Yalıkavak galeri"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="cover"
            />

            <div className="image-overlay" />

            <div className="gallery-page-hero-content">
              <p
                className="eyebrow light"
                style={cmsStyle(
                  "gallery-hero",
                  "eyebrow"
                )}
              >
                {hero?.eyebrow ||
                  "La Lara · Yalıkavak"}
              </p>

              <h1
                style={cmsStyle(
                  "gallery-hero",
                  "heading"
                )}
              >
                {hero?.heading
                  ? renderLines(
                      hero.heading
                    )
                  : (
                    <>
                      La Lara&apos;dan
                      <br />
                      Anlar
                    </>
                  )}
              </h1>

              <p
                style={cmsStyle(
                  "gallery-hero",
                  "text"
                )}
              >
                {hero?.body
                  ? renderLines(
                      hero.body
                    )
                  : (
                    <>
                      Sakin sabahlardan
                      gün batımı sofralarına
                      ve Yalıkavak
                      Körfezi&apos;ne karşı
                      uzayan akşamlara.
                    </>
                  )}
              </p>
            </div>
          </section>
        )}

      {/* ===================================================
          GALLERY GRID — SINIRSIZ FOTOĞRAF
          =================================================== */}

      {media.photos.length >
        0 && (
        <section className="gallery-page-grid">
          {media.photos.map(
            (src, index) => (
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
            )
          )}
        </section>
      )}

      {/* ===================================================
          CTA
          =================================================== */}

      {isVisible(
        "gallery-cta"
      ) && (
        <section className="gallery-page-cta">
          <p
            className="eyebrow"
            style={cmsStyle(
              "gallery-cta",
              "eyebrow"
            )}
          >
            {cta?.eyebrow ||
              "Masanız Sizi Bekliyor"}
          </p>

          <h2
            style={cmsStyle(
              "gallery-cta",
              "heading"
            )}
          >
            {cta?.heading
              ? renderLines(
                  cta.heading
                )
              : (
                <>
                  La Lara&apos;yı
                  <br />
                  deneyimleyin.
                </>
              )}
          </h2>

          {cta?.body && (
            <p
              style={cmsStyle(
                "gallery-cta",
                "text"
              )}
            >
              {renderLines(
                cta.body
              )}
            </p>
          )}

          <div className="gallery-page-actions">
            <Link
              href="/tr#menus"
              className="line-link"
            >
              MENÜLERİMİZİ GÖRÜN{" "}
              <span>→</span>
            </Link>

            <a
              href={
                cta?.buttonLink ||
                reservationHref
              }
              target="_blank"
              rel="noopener noreferrer"
              className="outline-button gallery-dark-button"
            >
              {cta?.buttonLabel ||
                "REZERVASYON TALEBİ"}
            </a>
          </div>
        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <Footer locale="tr" />
    </main>
  );
}