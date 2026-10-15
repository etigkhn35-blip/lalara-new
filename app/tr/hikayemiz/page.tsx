import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Hikâyemiz | La Lara Restaurant & Bar Yalıkavak",
  description:
    "La Lara Restaurant & Bar'ın aile hikâyesini keşfedin. Lara'nın hikâyesi, pembe fil geleneği ve La Lara'ya ilham veren aile anıları.",
};

export default function HikayemizPage() {
  return (
    <main className="story-page">
      {/* HEADER */}
      <Header locale="tr" />

      {/* HERO */}
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
          <p className="eyebrow light">La Lara · Yalıkavak</p>

          <h1>Hikâyemiz</h1>

          <p>
            La Lara&apos;yı var eden insanlar, anılar
            <br />
            ve küçük detaylar.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="story-page-intro">
        <p className="eyebrow">Her Şeyin Başladığı Yer</p>

        <h2>
          İsmin Ardındaki
          <br />
          Kadın
        </h2>

        <p className="story-page-lead">
          Her ailede herkesi bir araya getiren biri vardır.
          <br />
          Bizim ailemizde bu kişi Lara&apos;ydı.
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
          <p className="eyebrow">01 · Lara</p>

          <h2>
            Sıcak, zarif
            <br />
            ve karakter dolu.
          </h2>

          <p>
            Büyükannemiz hiç de hayal edebileceğiniz geleneksel
            büyükannelerden biri değildi. Kariyer sahibi, güçlü bir
            kişiliğe ve kendine özgü bir stile sahipti; kabul etmek
            gerekir ki biraz da diva ruhu vardı.
          </p>

          <p>
            Yemek yapmayı severdi ama insanları sofrasında ağırlamayı
            daha da çok severdi.
          </p>

          <p>
            Masasında her zaman bir misafire, yeni bir hikâyeye ve
            başka bir sohbete yer vardı. Yemekler çoğu zaman
            planlanandan daha uzun sürerdi. İnsanlar gülmek, haberleri
            paylaşmak, bazen bir problemi çözmek ve her zaman güzel
            bir şeyler yemek için bir araya gelirdi.
          </p>

          <p>
            Lara için misafirperverlik büyük bir gösteri yapmak
            değildi. İnsanların kendilerini rahat, değerli ve
            evlerinde hissetmelerini sağlamaktı.
          </p>

          <p>Ve bunu son derece doğal bir şekilde yapardı.</p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="story-page-quote">
        <p>
          “Kendi restoranımızı hayal etmeye başladığımızda,
          <br />
          tekrar tekrar o anılara döndük.”
        </p>
      </section>

      {/* RESTAURANT */}
      <section className="story-page-section story-page-section-reverse">
        <div className="story-page-copy">
          <p className="eyebrow">La Lara</p>

          <h2>
            O hissi
            <br />
            yaşatmak.
          </h2>

          <p>
            Amacımız onun evini yeniden yaratmak değildi. O sofradaki
            hissi yeni bir yere taşımak istedik.
          </p>

          <p>
            İyi yemeklerin insanları bir araya getirdiği bir yer.
            Sohbetlerin aceleye gelmediği, atmosferin zarif ama hiçbir
            zaman fazla resmi olmadığı bir yer.
          </p>

          <p>Sıcak, canlı ve karakter dolu.</p>

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

      {/* PINK ELEPHANT */}
      <section className="story-page-elephant">
        <div className="story-page-elephant-heading">
          <p className="eyebrow">Bir Aile Geleneği</p>

          <h2>
            Pembe Filler
            <br />
            Görmen Dileğiyle
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

          <div className="story-page-elephant-copy">
            <p>
              Çocukken, yatmadan önce büyükannemiz hep
              &quot;Pembe filler görmen dileğiyle&quot; derdi.
            </p>

            <p>
              Bunun ne anlama geldiğini hiç sorgulamadık. Sadece ona
              özgü, biraz tuhaf ama sevgi dolu alışkanlıklardan
              biriydi; kişisel, eğlenceli ve biraz da gizemli.
            </p>

            <blockquote>
              “Pembe filler görmen dileğiyle.”
            </blockquote>

            <p>
              Bugün, onun bu sözlerine yeni bir anlam katmayı
              seviyoruz. &quot;Pembe filler görmen dileğiyle&quot;
              sözü; meraklı kalmanın, görünenin ötesini düşünmenin ve
              biraz daha büyük hayaller kurmanın bir hatırlatıcısı
              bizim için.
            </p>

            <p>
              Pembe fil, restoranımızın simgesi haline geldi.
              Başkalarına belki son derece rastgele bir seçim gibi
              görünebilir; ama bizim için o, evimizden küçük bir parça
              taşıyor.
            </p>
          </div>
        </div>
      </section>

      {/* PEOPLE BEHIND */}
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
            <p className="eyebrow light">Emeği Geçenler</p>

            <h2>
              Bir aileden,
              <br />
              bir sofraya.
            </h2>
          </div>

          <div className="story-page-people-copy">
            <p>
              Restoran adını Lara&apos;dan alsa da, bu hikâye tek bir
              kişiye ait değil.
            </p>

            <p>
              Bu hikâye aynı zamanda çocukluğumuzu şekillendiren ve
              mutfaklarında büyüdüğümüz tüm büyükannelerimiz ve
              büyükbabalarımız için.
            </p>

            <p>
              Onların her biri bize hiçbir tarifin tam olarak
              anlatamayacağı bir şey bıraktı: Bir sofrayı paylaşmanın
              yemekten çok daha fazlası olduğunu.
            </p>

            <p>
              La Lara, bu anıları geleceğe taşıma ve soframıza katılan
              insanlarla yeni anılar yaratma biçimimiz.
            </p>

            <p>
              Yani burası, kendine has bir şekilde, bir teşekkür
              niteliğinde.
            </p>

            <strong>
              Lara, Vova, Vitali ve Raya&apos;ya...
            </strong>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="story-page-cta">
        <p className="eyebrow">La Lara · Yalıkavak</p>

        <h2>
          Şimdi kendi
          <br />
          anılarınızı yaratın.
        </h2>

        <div className="story-page-cta-actions">
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
            className="outline-button story-page-dark-button tr-uppercase"
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