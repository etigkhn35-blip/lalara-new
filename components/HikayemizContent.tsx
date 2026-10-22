"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/lib/cms/useSiteContent";
import { storyOriginals } from "@/lib/cms/story";

export type StoryMedia = {
  hero: string;
  lara: string;
  restaurant: string;
  people: string;
};

type HikayemizContentProps = { initialMedia: StoryMedia };

function renderLines(value = "") {
  return value.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function splitParagraphs(value = "") {
  return value.split(/\n\s*\n/).filter(Boolean);
}

function renderPinkElephant(value = "") {
  return splitParagraphs(value).map((paragraph, index) =>
    index === 2 ? (
      <blockquote key={index}>{renderLines(paragraph)}</blockquote>
    ) : (
      <p key={index}>{renderLines(paragraph)}</p>
    )
  );
}

function renderPeople(value = "") {
  const paragraphs = splitParagraphs(value);
  return paragraphs.map((paragraph, index) =>
    index === paragraphs.length - 1 ? (
      <strong key={index}>{renderLines(paragraph)}</strong>
    ) : (
      <p key={index}>{renderLines(paragraph)}</p>
    )
  );
}

export default function HikayemizContent({ initialMedia }: HikayemizContentProps) {
  const media = initialMedia;
  const { ready, getContent, isVisible, styleFor } = useSiteContent({
    locale: "tr",
    originals: storyOriginals.tr,
  });

  const hero = getContent("story-hero");
  const womanIntro = getContent("story-woman-intro");
  const laraDetail = getContent("story-lara-detail");
  const storyQuote = getContent("story-quote");
  const storyPlace = getContent("story-place");
  const elephant = getContent("pink-elephant");
  const people = getContent("the-people-behind-our-story");
  const cta = getContent("story-cta");

  const whatsappHref = "https://wa.me/905458941838?text=" + encodeURIComponent("Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:");

  return (
    <main className="story-page">
      <Header locale="tr" />

      <div style={{ visibility: ready ? "visible" : "hidden" }} aria-busy={!ready}>
        {media.hero && isVisible("story-hero") && (
          <section className="story-page-hero" style={{ background: "transparent" }}>
            <Image src={media.hero} alt="La Lara Restaurant & Bar Yalıkavak" fill priority fetchPriority="high" sizes="100vw" className="cover" />
            <div className="image-overlay" />
            <div className="story-page-hero-content">
              <p className="eyebrow light" style={styleFor("story-hero", "eyebrow")}>{hero?.eyebrow}</p>
              <h1 style={styleFor("story-hero", "heading")}>{renderLines(hero?.heading)}</h1>
              <p style={styleFor("story-hero", "text")}>{renderLines(hero?.body)}</p>
            </div>
          </section>
        )}

        {isVisible("story-woman-intro") && (
          <>
            <section className="story-page-intro">
              <p className="eyebrow" style={styleFor("story-woman-intro", "eyebrow")}>{womanIntro?.eyebrow}</p>
              <h2 style={styleFor("story-woman-intro", "heading")}>{renderLines(womanIntro?.heading)}</h2>
              <p className="story-page-lead" style={styleFor("story-woman-intro", "text")}>{renderLines(womanIntro?.body)}</p>
            </section>

            {isVisible("story-lara-detail") && (
              <section className="story-page-section story-page-section-lara">
                <div className="story-page-image">
                  {media.lara && <Image src={media.lara} alt="Lara ve La Lara'nın ilham veren hikâyesi" fill sizes="(max-width:900px) 100vw,50vw" className="cover" />}
                </div>
                <div className="story-page-copy">
                  <h2 style={styleFor("story-lara-detail", "heading")}>{renderLines(laraDetail?.heading)}</h2>
                  {splitParagraphs(laraDetail?.body).map((paragraph, index) => (
                    <p key={index} style={styleFor("story-lara-detail", "text")}>{renderLines(paragraph)}</p>
                  ))}
                </div>
              </section>
            )}

            {isVisible("story-quote") && (
              <section className="story-page-quote">
                <p style={styleFor("story-quote", "text")}>{renderLines(storyQuote?.body)}</p>
              </section>
            )}

            {isVisible("story-place") && (
              <section className="story-page-section story-page-section-reverse">
                <div className="story-page-copy">
                  <p className="eyebrow" style={styleFor("story-place", "eyebrow")}>{storyPlace?.eyebrow}</p>
                  <h2 style={styleFor("story-place", "heading")}>{renderLines(storyPlace?.heading)}</h2>
                  {splitParagraphs(storyPlace?.body).map((paragraph, index) => (
                    <p key={index} style={styleFor("story-place", "text")}>{renderLines(paragraph)}</p>
                  ))}
                </div>
                <div className="story-page-image">
                  {media.restaurant && <Image src={media.restaurant} alt="La Lara Restaurant Yalıkavak atmosferi" fill sizes="(max-width:900px) 100vw,50vw" className="cover" />}
                </div>
              </section>
            )}
          </>
        )}

        {isVisible("pink-elephant") && (
          <section className="story-page-elephant">
            <div className="story-page-elephant-heading">
              <p className="eyebrow" style={styleFor("pink-elephant", "eyebrow")}>{elephant?.eyebrow}</p>
              <h2 style={styleFor("pink-elephant", "heading")}>{renderLines(elephant?.heading)}</h2>
            </div>
            <div className="story-page-elephant-grid">
              <div className="story-page-elephant-mark" aria-hidden="true"><Image src="/pink-elephant.ico" alt="" width={150} height={150} /></div>
              <div className="story-page-elephant-copy" style={styleFor("pink-elephant", "text")}>{renderPinkElephant(elephant?.body)}</div>
            </div>
          </section>
        )}

        {isVisible("the-people-behind-our-story") && (
          <section className="story-page-people">
            <div className="story-page-people-image">
              {media.people && <Image src={media.people} alt="La Lara'nın aileden ilham alan misafirperverliği" fill sizes="(max-width:900px) 100vw,50vw" className="cover" />}
              {media.people && <div className="image-overlay" />}
            </div>
            <div className="story-page-people-content">
              <p className="eyebrow light" style={styleFor("the-people-behind-our-story", "eyebrow")}>{people?.eyebrow}</p>
              <h2 style={styleFor("the-people-behind-our-story", "heading")}>{renderLines(people?.heading)}</h2>
              <div className="story-page-people-copy" style={styleFor("the-people-behind-our-story", "text")}>{renderPeople(people?.body)}</div>
            </div>
          </section>
        )}

        {isVisible("story-cta") && (
          <section className="story-page-cta">
            <p className="eyebrow" style={styleFor("story-cta", "eyebrow")}>{cta?.eyebrow}</p>
            <h2 style={styleFor("story-cta", "heading")}>{renderLines(cta?.heading)}</h2>
            {cta?.body && <p style={styleFor("story-cta", "text")}>{renderLines(cta.body)}</p>}
            <div className="story-page-cta-actions">
              <Link href="/tr#menus" className="line-link">MENÜLERİMİZİ GÖRÜN <span>→</span></Link>
              <a href={cta?.buttonLink || whatsappHref} target="_blank" rel="noopener noreferrer" className="outline-button story-page-dark-button tr-uppercase" style={styleFor("story-cta", "button")}>{cta?.buttonLabel}</a>
            </div>
          </section>
        )}
      </div>

      <Footer locale="tr" />
    </main>
  );
}
