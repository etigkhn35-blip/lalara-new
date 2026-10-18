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

type GalleryContentProps = {
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

export default function GalleryContent({
  initialMedia,
}: GalleryContentProps) {
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
              item.id.startsWith("en-") &&
              data.status === "published"
            ) {
              nextCms[
                item.id.replace(
                  "en-",
                  ""
                )
              ] = data;
            }
          }
        );

        setCms(nextCms);
      } catch (error) {
        console.error(
          "Gallery CMS load error:",
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

  /*
   * Font family is intentionally NOT
   * controlled by CMS.
   *
   * Button typography is also NOT
   * controlled by CMS.
   *
   * This preserves the website's
   * existing typography.
   */

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

      ...(item.letterSpacing !== undefined
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
                      Moments
                      <br />
                      at La Lara
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
                      From quiet mornings
                      to sunset dinners
                      and evenings
                      overlooking
                      Yalıkavak Bay.
                    </>
                  )}
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
            style={cmsStyle(
              "gallery-cta",
              "eyebrow"
            )}
          >
            {cta?.eyebrow ||
              "Your Table Awaits"}
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
                  Experience La Lara
                  <br />
                  for yourself.
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
              {cta?.buttonLabel ||
                "REQUEST A RESERVATION"}
            </a>

          </div>
        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <Footer locale="en" />

    </main>
  );
}