"use client";

import Image from "next/image";
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
  const media = initialMedia;
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
            style={{
              background:
                "transparent",
            }}
          >
            <Image
              src={media.hero}
              alt="La Lara Restaurant & Bar gallery in Yalıkavak"
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