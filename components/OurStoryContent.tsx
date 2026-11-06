
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
  elephant?: string;
  people1?: string;
  people2?: string;
  people3?: string;
};

type OurStoryContentProps = {
  initialMedia: StoryMedia;
};

function renderLines(value = "") {
  return value.split("\n").map((line, index, lines) => (
    <span key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function splitParagraphs(value = "") {
  return value.split(/\n\s*\n/).filter(Boolean);
}

function renderParagraphs(value = "") {
  return splitParagraphs(value).map((paragraph, index) => (
    <p key={index}>{renderLines(paragraph)}</p>
  ));
}

function renderPinkElephant(value = "") {
  return splitParagraphs(value).map((paragraph, index) =>
    index === 2 ? (
      <blockquote key={index}>
        {renderLines(paragraph)}
      </blockquote>
    ) : (
      <p key={index}>{renderLines(paragraph)}</p>
    )
  );
}

function renderPeople(value = "") {
  const paragraphs = splitParagraphs(value);

  return paragraphs.map((paragraph, index) => {
    if (index === paragraphs.length - 2) {
      return (
        <strong key={index}>
          {renderLines(paragraph)}
        </strong>
      );
    }

    if (index === paragraphs.length - 1) {
      return (
        <em key={index}>
          {renderLines(paragraph)}
        </em>
      );
    }

    return <p key={index}>{renderLines(paragraph)}</p>;
  });
}

export default function OurStoryContent({
  initialMedia,
}: OurStoryContentProps) {
  const media = initialMedia;

  const { ready, getContent, isVisible, styleFor } =
    useSiteContent({
      locale: "en",
      originals: storyOriginals.en,
    });

  const hero = getContent("story-hero");
  const womanIntro = getContent("story-woman-intro");
  const laraDetail = getContent("story-lara-detail");
  const storyPlace = getContent("story-place");
  const elephant = getContent("pink-elephant");
  const people = getContent("the-people-behind-our-story");
  const cta = getContent("story-cta");

  const heroHeading = hero?.heading || "Our Story";

  const heroBody =
    hero?.body ||
    "La Lara was created around a simple idea. Good food tastes better when it is shared with the people you love.";

  const beginningEyebrow =
    womanIntro?.eyebrow ||
    "A FEW WORDS FROM THE OWNER FAMILY";

  const beginningHeading =
    womanIntro?.heading || "Where it began.";

  const beginningBody =
    womanIntro?.body ||
    laraDetail?.body ||
    "";

  const inspirationEyebrow =
    storyPlace?.eyebrow || "THE RESTAURANT";

  const inspirationHeading =
    storyPlace?.heading || "Our Inspiration.";

  const inspirationBody = storyPlace?.body || "";

  const elephantEyebrow =
    elephant?.eyebrow || "THE PINK ELEPHANT";

  const elephantHeading =
    elephant?.heading || "Dream A Little Bigger.";

  const peopleEyebrow =
    people?.eyebrow || "A FAMILY TIES";

  const peopleHeading =
    people?.heading || "The People Behind It.";

  const ctaHeading =
    cta?.heading ||
    "Come And Make\nYour Own Memories.";

  const ctaLink =
    cta?.buttonLink ||
    storyOriginals.en["story-cta"]?.buttonLink ||
    "#";

  return (
    <main className="story-page story-full">
      <Header locale="en" />

      <div
        className="story-full-main"
        style={{
          visibility: ready ? "visible" : "hidden",
        }}
        aria-busy={!ready}
      >
        {/* 01 - HERO */}

        {isVisible("story-hero") && (
          <section className="story-full-hero">
            {media.hero && (
              <Image
                src={media.hero}
                alt="Yalıkavak landscape"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="story-full-cover"
              />
            )}

            <div className="story-full-hero-overlay" />

            <div className="story-full-hero-content">
              <h1 style={styleFor("story-hero", "heading")}>
                {renderLines(heroHeading)}
              </h1>

              <p style={styleFor("story-hero", "text")}>
                {renderLines(heroBody)}
              </p>
            </div>
          </section>
        )}

        {/* 02 - WHERE IT BEGAN */}

        {isVisible("story-woman-intro") && (
          <section className="story-full-beginning">
            <div className="story-full-container">
              <div className="story-full-two-column">
                <div className="story-full-copy">
                  <p
                    className="story-full-eyebrow"
                    style={styleFor(
                      "story-woman-intro",
                      "eyebrow"
                    )}
                  >
                    {beginningEyebrow}
                  </p>

                  <h2
                    style={styleFor(
                      "story-woman-intro",
                      "heading"
                    )}
                  >
                    {renderLines(beginningHeading)}
                  </h2>

                  <div
                    className="story-full-body"
                    style={styleFor(
                      "story-woman-intro",
                      "text"
                    )}
                  >
                    {renderParagraphs(beginningBody)}
                  </div>
                </div>

                <div className="story-full-photo">
                  {media.lara && (
                    <Image
                      src={media.lara}
                      alt="Portrait of Lara"
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      className="story-full-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 03 - OUR INSPIRATION */}

        {isVisible("story-place") && (
          <section className="story-full-inspiration">
            <div className="story-full-container">
              <div className="story-full-two-column">
                <div className="story-full-photo">
                  {media.restaurant && (
                    <Image
                      src={media.restaurant}
                      alt="Lara in the kitchen"
                      fill
                      sizes="(max-width: 900px) 100vw, 45vw"
                      className="story-full-cover"
                    />
                  )}
                </div>

                <div className="story-full-copy">
                  <p
                    className="story-full-eyebrow"
                    style={styleFor(
                      "story-place",
                      "eyebrow"
                    )}
                  >
                    {inspirationEyebrow}
                  </p>

                  <h2
                    style={styleFor(
                      "story-place",
                      "heading"
                    )}
                  >
                    {renderLines(inspirationHeading)}
                  </h2>

                  <div
                    className="story-full-body"
                    style={styleFor(
                      "story-place",
                      "text"
                    )}
                  >
                    {renderParagraphs(inspirationBody)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 04 - DREAM A LITTLE BIGGER */}

        {isVisible("pink-elephant") && (
          <section className="story-full-elephant">
            <div className="story-full-container">
              <div className="story-full-two-column">
                <div className="story-full-copy">
                  <p
                    className="story-full-eyebrow"
                    style={styleFor(
                      "pink-elephant",
                      "eyebrow"
                    )}
                  >
                    {elephantEyebrow}
                  </p>

                  <h2
                    style={styleFor(
                      "pink-elephant",
                      "heading"
                    )}
                  >
                    {renderLines(elephantHeading)}
                  </h2>

                  <div
                    className="story-full-body"
                    style={styleFor(
                      "pink-elephant",
                      "text"
                    )}
                  >
                    {renderPinkElephant(
                      elephant?.body || ""
                    )}
                  </div>
                </div>

               <div className="story-full-elephant-visual">
  <div className="story-full-elephant-photo">
    <Image
      src={media.elephant || "/images/story/pink-elephant.jpg"}
      alt="A childhood memory behind the pink elephant story"
      fill
      sizes="(max-width: 900px) 100vw, 40vw"
      className="story-full-cover"
    />
  </div>
</div>
              </div>
            </div>
          </section>
        )}

        {/* 05 - THE PEOPLE BEHIND IT */}

        {isVisible(
          "the-people-behind-our-story"
        ) && (
          <section className="story-full-people">
            <div className="story-full-container">
              <div className="story-full-two-column">
             
<div className="story-full-people-images">
  <div className="story-full-people-photo story-full-people-photo-1">
    <Image
      src={media.people1 || "/images/story/people-1.jpg"}
      alt="Family memory with Lara"
      fill
      sizes="(max-width: 900px) 45vw, 22vw"
      className="story-full-cover"
    />
  </div>

  <div className="story-full-people-photo story-full-people-photo-2">
    <Image
      src={media.people2 || "/images/story/people-2.jpg"}
      alt="A family photograph"
      fill
      sizes="(max-width: 900px) 30vw, 15vw"
      className="story-full-cover"
    />
  </div>

  <div className="story-full-people-photo story-full-people-photo-3">
    <Image
      src={media.people3 || "/images/story/people-3.jpg"}
      alt="A treasured family memory"
      fill
      sizes="(max-width: 900px) 45vw, 22vw"
      className="story-full-cover"
    />
  </div>
</div>


                <div className="story-full-copy">
                  <p
                    className="story-full-eyebrow"
                    style={styleFor(
                      "the-people-behind-our-story",
                      "eyebrow"
                    )}
                  >
                    {peopleEyebrow}
                  </p>

                  <h2
                    style={styleFor(
                      "the-people-behind-our-story",
                      "heading"
                    )}
                  >
                    {renderLines(peopleHeading)}
                  </h2>

                  <div
                    className="story-full-body story-full-people-body"
                    style={styleFor(
                      "the-people-behind-our-story",
                      "text"
                    )}
                  >
                    {renderPeople(people?.body || "")}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 06 - COME AND MAKE YOUR OWN MEMORIES */}

        {isVisible("story-cta") && (
          <section className="story-full-cta">
            <div className="story-full-cta-inner">
              {cta?.eyebrow && (
                <p
                  className="story-full-eyebrow"
                  style={styleFor(
                    "story-cta",
                    "eyebrow"
                  )}
                >
                  {cta.eyebrow}
                </p>
              )}

              <h2
                style={styleFor(
                  "story-cta",
                  "heading"
                )}
              >
                {renderLines(ctaHeading)}
              </h2>

              {cta?.body && (
                <p
                  className="story-full-cta-description"
                  style={styleFor(
                    "story-cta",
                    "text"
                  )}
                >
                  {renderLines(cta.body)}
                </p>
              )}

              <div className="story-full-cta-actions">
                <Link
                  href="/#menus"
                  className="story-full-text-link"
                >
                  VIEW OUR MENUS
                </Link>

                <a
                  href={ctaLink}
                  className="story-full-cta-button"
                  style={styleFor(
                    "story-cta",
                    "button"
                  )}
                  target={
                    ctaLink.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    ctaLink.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {cta?.buttonLabel ||
                    "RESERVE A TABLE"}
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer locale="en" />
    </main>
  );
}
