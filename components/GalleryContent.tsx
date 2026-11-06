"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/lib/cms/useSiteContent";
import { galleryOriginals } from "@/lib/cms/gallery";

/* =========================================================
   TYPES
   ========================================================= */



export type GalleryMedia = {
  hero: string;
  photos: string[];
};

type GalleryContentProps = {
  initialMedia: GalleryMedia;
};

/* =========================================================
   HELPERS
   ========================================================= */

function renderLines(value = "") {
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

export default function GalleryContent({
  initialMedia,
}: GalleryContentProps) {
  const [media, setMedia] = useState<GalleryMedia>(initialMedia ?? { hero: "", photos: [] });

  useEffect(() => {
    return onSnapshot(
      doc(db, "pageMedia", "gallery"),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const fields = snapshot.data()?.fields;
        setMedia({
          hero: typeof fields?.hero === "string" ? fields.hero : "",
          photos: Array.isArray(fields?.photos)
            ? fields.photos.filter((url: unknown): url is string => typeof url === "string" && url.length > 0)
            : [],
        });
      },
      (error) => console.error("Gallery media:", error)
    );
  }, []);
  const { ready, getContent, isVisible, styleFor } = useSiteContent({
    locale: "en",
    originals: galleryOriginals.en,
  });

  const hero = getContent("gallery-hero");
  const cta = getContent("gallery-cta");

  /* =======================================================
     RESERVATION
     ======================================================= */

  const reservationHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Hello La Lara, I would like to request a reservation.\n\nDate:\nTime:\nNumber of guests:"
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="gallery-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header locale="en" />

      <div style={{ visibility: ready ? "visible" : "hidden" }} aria-busy={!ready}>

      {/* ===================================================
          HERO
          =================================================== */}

      {isVisible(
        "gallery-hero"
      ) &&
        media.hero && (
          <section
            className="gallery-page-hero"
            style={{ background: "transparent", height: "auto", minHeight: 0 }}
          >
            {/* Natural image ratio: no cropping */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.hero}
              alt="La Lara Restaurant & Bar gallery in Yalıkavak"
              className="gallery-natural-hero-image"
              fetchPriority="high"
            />

            <div className="image-overlay" />

            <div className="gallery-page-hero-content">

              <p
                className="eyebrow light"
                style={styleFor(
                  "gallery-hero",
                  "eyebrow"
                )}
              >
                {hero?.eyebrow}
              </p>

              <h1
                style={styleFor(
                  "gallery-hero",
                  "heading"
                )}
              >
                {renderLines(hero?.heading)}
              </h1>

              <p
                style={styleFor(
                  "gallery-hero",
                  "text"
                )}
              >
                {renderLines(hero?.body)}
              </p>

            </div>
          </section>
        )}

      {/* ===================================================
          GALLERY GRID — UNLIMITED PHOTOS
          =================================================== */}

      {media.photos.length > 0 && (
        <section className="gallery-page-grid">
          {media.photos.map(
            (src, index) => (
              <figure
                className={`gallery-page-item gallery-page-item-${(index % 6) + 1}`}
                key={`${src}-${index}`}
                style={{ position: "relative", height: "auto", minHeight: 0, aspectRatio: "auto" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`La Lara Restaurant & Bar Yalıkavak ${index + 1}`}
                  loading="lazy"
                  className="gallery-natural-grid-image"
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
            style={styleFor(
              "gallery-cta",
              "eyebrow"
            )}
          >
            {cta?.eyebrow}
          </p>

          <h2
            style={styleFor(
              "gallery-cta",
              "heading"
            )}
          >
            {renderLines(cta?.heading)}
          </h2>

          {cta?.body && (
            <p
              style={styleFor(
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
              href="/#menus"
              className="line-link"
            >
              VIEW OUR MENUS{" "}
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
              {cta?.buttonLabel}
            </a>

          </div>
        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

            </div>

      <Footer locale="en" />

    </main>
  );
}