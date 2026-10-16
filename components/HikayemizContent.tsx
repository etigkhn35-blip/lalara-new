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

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;

  buttonLabel?: string;
  buttonLink?: string;



  visible?: boolean;
  status?: string;
};

function renderLines(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function HikayemizContent() {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

 useEffect(() => {
  async function loadContent() {
    try {
      const snapshot = await getDocs(
        collection(db, "siteContent")
      );

      const nextCms: Record<string, CmsRecord> = {};

      snapshot.forEach((item) => {
        const data = item.data() as CmsRecord;

        if (
          item.id.startsWith("tr-") &&
          data.status === "published"
        ) {
          nextCms[
            item.id.replace("tr-", "")
          ] = data;
        }
      });

      setCms(nextCms);
    } catch (error) {
      console.error(
        "La Lara TR story CMS load error:",
        error
      );
    } finally {
      
    }
  }

  loadContent();
}, []);

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return cms[key]?.visible !== false;
  }

  const hero =
    content("story-hero");
   

  const lara =
    content("the-woman-behind-the-name");

  const elephant =
    content("pink-elephant");

  const people =
    content("the-people-behind-our-story");

  const cta =
    content("story-cta");

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:"
    );

  return (
    <main className="story-page">
      <Header locale="tr" />
    

      {/* =====================================================
          HERO
          ===================================================== */}
{isVisible("story-hero") && (
  <section className="story-page-hero">
    <Image
      src="/images/home/7.jpg"
      alt="La Lara Restaurant'ın aile hikâyesi"
      fill
      priority
      sizes="100vw"
      className="cover"
    />

    <div className="image-overlay" />

    <div className="story-page-hero-content">
      <p className="eyebrow light">
        La Lara · Yalıkavak
      </p>

      <h1>Hikâyemiz</h1>

      <p>
        La Lara&apos;yı var eden insanlar, anılar
        <br />
        ve küçük detaylar.
      </p>
    </div>
  </section>
)}

      {/* =====================================================
          THE WOMAN BEHIND THE NAME
          ===================================================== */}

      {isVisible(
        "the-woman-behind-the-name"
      ) && (
        <>
          <section className="story-page-intro">
            <p
              className="eyebrow"
            >
              {lara?.eyebrow ||
                "Her Şeyin Başladığı Yer"}
            </p>

            <h2
            >
              {lara?.heading
                ? renderLines(lara.heading)
                : (
                  <>
                    İsmin Ardındaki
                    <br />
                    Kadın
                  </>
                )}
            </h2>

            <p className="story-page-lead">
              Her ailede herkesi bir araya
              getiren biri vardır.
              <br />
              Bizim ailemizde bu kişi
              Lara&apos;ydı.
            </p>
          </section>

          {/* LARA */}

          <section className="story-page-section story-page-section-lara">
            <div className="story-page-image">
              <Image
                src="/images/home/7.jpg"
                alt="Lara ve La Lara'nın ilham veren hikâyesi"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="cover"
              />
            </div>

            <div className="story-page-copy">
              <h2>
                Sıcak, zarif
                <br />
                ve karakter dolu.
              </h2>

              {lara?.body ? (
                <div
                  style={{ whiteSpace: "pre-line" }}
                >
                  {lara.body}
                </div>
              ) : (
                <>
                  <p>
                    Büyükannemiz hiç de hayal
                    edebileceğiniz geleneksel
                    büyükannelerden biri
                    değildi. Kariyer sahibi,
                    güçlü bir kişiliğe ve
                    kendine özgü bir stile
                    sahipti; kabul etmek
                    gerekir ki biraz da diva
                    ruhu vardı.
                  </p>

                  <p>
                    Yemek yapmayı severdi ama
                    insanları sofrasında
                    ağırlamayı daha da çok
                    severdi.
                  </p>

                  <p>
                    Masasında her zaman bir
                    misafire, yeni bir
                    hikâyeye ve başka bir
                    sohbete yer vardı.
                    Yemekler çoğu zaman
                    planlanandan daha uzun
                    sürerdi. İnsanlar gülmek,
                    haberleri paylaşmak, bazen
                    bir problemi çözmek ve her
                    zaman güzel bir şeyler
                    yemek için bir araya
                    gelirdi.
                  </p>

                  <p>
                    Lara için misafirperverlik
                    büyük bir gösteri yapmak
                    değildi. İnsanların
                    kendilerini rahat, değerli
                    ve evlerinde
                    hissetmelerini sağlamaktı.
                  </p>

                  <p>
                    Ve bunu son derece doğal
                    bir şekilde yapardı.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* QUOTE */}

          <section className="story-page-quote">
            <p>
              “Kendi restoranımızı hayal
              etmeye başladığımızda,
              <br />
              tekrar tekrar o anılara döndük.”
            </p>
          </section>

          {/* RESTAURANT */}

          <section className="story-page-section story-page-section-reverse">
            <div className="story-page-copy">
              <p className="eyebrow">
                La Lara
              </p>

              <h2>
                O hissi
                <br />
                yaşatmak.
              </h2>

              <p>
                Amacımız onun evini yeniden
                yaratmak değildi. O sofradaki
                hissi yeni bir yere taşımak
                istedik.
              </p>

              <p>
                İyi yemeklerin insanları bir
                araya getirdiği bir yer.
                Sohbetlerin aceleye gelmediği,
                atmosferin zarif ama hiçbir
                zaman fazla resmi olmadığı
                bir yer.
              </p>

              <p>
                Sıcak, canlı ve karakter
                dolu.
              </p>

              <p>Tıpkı Lara gibi.</p>
            </div>

            <div className="story-page-image">
              <Image
                src="/images/home/2.jpg"
                alt="La Lara Restaurant Yalıkavak atmosferi"
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="cover"
              />
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          PINK ELEPHANT
          ===================================================== */}

      {isVisible("pink-elephant") && (
        <section className="story-page-elephant">
          <div className="story-page-elephant-heading">
            <p
              className="eyebrow"
            >
              {elephant?.eyebrow ||
                "Bir Aile Geleneği"}
            </p>

            <h2
            >
              {elephant?.heading
                ? renderLines(
                    elephant.heading
                  )
                : (
                  <>
                    Pembe Filler
                    <br />
                    Görmen Dileğiyle
                  </>
                )}
            </h2>
          </div>

          <div className="story-page-elephant-grid">
            <div
              className="story-page-elephant-mark"
              aria-hidden="true"
            >
              <Image
                src="/pink-elephant.ico"
                alt=""
                width={150}
                height={150}
              />
            </div>

            <div
              className="story-page-elephant-copy"
            >
              {elephant?.body ? (
                <div
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {elephant.body}
                </div>
              ) : (
                <>
                  <p>
                    Çocukken, yatmadan önce
                    büyükannemiz hep
                    &quot;Pembe filler görmen
                    dileğiyle&quot; derdi.
                  </p>

                  <p>
                    Bunun ne anlama geldiğini
                    hiç sorgulamadık. Sadece
                    ona özgü, biraz tuhaf ama
                    sevgi dolu
                    alışkanlıklardan biriydi;
                    kişisel, eğlenceli ve
                    biraz da gizemli.
                  </p>

                  <blockquote>
                    “Pembe filler görmen
                    dileğiyle.”
                  </blockquote>

                  <p>
                    Bugün, onun bu sözlerine
                    yeni bir anlam katmayı
                    seviyoruz. &quot;Pembe
                    filler görmen
                    dileğiyle&quot; sözü;
                    meraklı kalmanın,
                    görünenin ötesini
                    düşünmenin ve biraz daha
                    büyük hayaller kurmanın
                    bir hatırlatıcısı bizim
                    için.
                  </p>

                  <p>
                    Pembe fil, restoranımızın
                    simgesi haline geldi.
                    Başkalarına belki son
                    derece rastgele bir seçim
                    gibi görünebilir; ama
                    bizim için o, evimizden
                    küçük bir parça taşıyor.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PEOPLE
          ===================================================== */}

      {isVisible(
        "the-people-behind-our-story"
      ) && (
        <section className="story-page-people">
          <div className="story-page-people-image">
            <Image
              src="/images/home/8.jpg"
              alt="La Lara'nın aileden ilham alan misafirperverliği"
              fill
              sizes="100vw"
              className="cover"
            />

            <div className="image-overlay" />
          </div>

          <div className="story-page-people-content">
            <div>
              <p
                className="eyebrow light"
              >
                {people?.eyebrow ||
                  "Emeği Geçenler"}
              </p>

              <h2
              >
                {people?.heading
                  ? renderLines(
                      people.heading
                    )
                  : (
                    <>
                      Bir aileden,
                      <br />
                      bir sofraya.
                    </>
                  )}
              </h2>
            </div>

            <div
              className="story-page-people-copy"
            >
              {people?.body ? (
                <div
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {people.body}
                </div>
              ) : (
                <>
                  <p>
                    Restoran adını
                    Lara&apos;dan alsa da, bu
                    hikâye tek bir kişiye ait
                    değil.
                  </p>

                  <p>
                    Bu hikâye aynı zamanda
                    çocukluğumuzu şekillendiren
                    ve mutfaklarında
                    büyüdüğümüz tüm
                    büyükannelerimiz ve
                    büyükbabalarımız için.
                  </p>

                  <p>
                    Onların her biri bize
                    hiçbir tarifin tam olarak
                    anlatamayacağı bir şey
                    bıraktı: Bir sofrayı
                    paylaşmanın yemekten çok
                    daha fazlası olduğunu.
                  </p>

                  <p>
                    La Lara, bu anıları
                    geleceğe taşıma ve
                    soframıza katılan
                    insanlarla yeni anılar
                    yaratma biçimimiz.
                  </p>

                  <p>
                    Yani burası, kendine has
                    bir şekilde, bir teşekkür
                    niteliğinde.
                  </p>

                  <strong>
                    Lara, Vova, Vitali ve
                    Raya&apos;ya...
                  </strong>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
          ===================================================== */}

      {isVisible("story-cta") && (
        <section className="story-page-cta">
          <p
            className="eyebrow"
          >
            {cta?.eyebrow ||
              "La Lara · Yalıkavak"}
          </p>

          <h2
          >
            {cta?.heading
              ? renderLines(cta.heading)
              : (
                <>
                  Şimdi kendi
                  <br />
                  anılarınızı yaratın.
                </>
              )}
          </h2>

          {cta?.body && (
            <p
            >
              {renderLines(cta.body)}
            </p>
          )}

          <div className="story-page-cta-actions">
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
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
              className="outline-button story-page-dark-button tr-uppercase"
            >
              {cta?.buttonLabel ||
                "REZERVASYON TALEBİ"}
            </a>
          </div>
        </section>
      )}

      <Footer locale="tr" />
    </main>
  );
}