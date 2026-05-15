import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { X, Eye } from "lucide-react";

import congregation from "@/assets/congregation.jpeg";
import generalOverseer from "@/assets/general-overseer.jpeg";
import worship from "@/assets/worship.jpeg";
import womensDay from "@/assets/womens-day.jpeg";
import heroBg from "@/assets/hero-bg.jpg";
import MenFellowship from "@/assets/MenFellowship.jpeg";
import GuestPreacher from "@/assets/GuestPreacher.jpeg";
import { useLanguage } from "@/lib/language";

const content = {
  en: {
    eyebrow: "Our Moments",
    title: "Life at UCFM",
    thumbnailSuffix: "image thumbnail",
    closeDialog: "Close image dialog",
    dialogSuffix: "image dialog",
    images: [
      {
        src: heroBg,
        alt: "UCFM members sitting in a close circle with open Bibles, engaged in a group prayer session.",
        title: "The Sacred Circle",
        scripture:
          "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here! - 2 Corinthians 5:17",
        description:
          "Your past does not define your future. We are dedicated to the journey of making zeros heroes by uncovering the strength and purpose God has placed within each of us. Explore the Word with us and celebrate the new life we find in worship and service.",
      },
      {
        src: congregation,
        alt: "A wide-angle view of the UCFM congregation with raised hands during a Sunday worship service.",
        title: "Heartfelt Adoration",
        description:
          "Lifting one voice in praise, where the presence of God meets the hearts of His people.",
      },
      {
        src: generalOverseer,
        alt: "Rev. King Prosper standing at the pulpit while preaching to the congregation.",
        title: "Divine Wisdom",
        description:
          "Rev. King Prosper delivering a transformative message of hope and purpose from the Mercy Ground pulpit.",
      },
      {
        src: worship,
        alt: "Worship team leading intimate praise during Friday Absolute Worship.",
        title: "Deep Worship",
        description:
          "A quiet moment of spiritual surrender led by the UCFM worship team during our Friday Absolute Worship.",
      },
      {
        src: womensDay,
        alt: "UCFM community celebrating in Amsterdam.",
        title: "Celebration",
        description: "Joyful smiles and shared laughter during a special UCFM community celebration in Amsterdam.",
      },
      {
        src: MenFellowship,
        alt: "Men's Fellowship meeting at UCFM.",
        title: "Men's Fellowship",
        description: "Men gathering for fellowship, mentorship and prayer.",
      },
      {
        src: GuestPreacher,
        alt: "Dr. Abel Damina sharing powerful biblical truths.",
        title: "Guest Preacher - Dr. Abel Damina",
        description:
          "Dr. Abel Damina sharing powerful biblical truths during a special guest ministry session at UCFM.",
      },
    ],
  },
  nl: {
    eyebrow: "Onze Momenten",
    title: "Leven bij UCFM",
    thumbnailSuffix: "afbeeldingsminiatuur",
    closeDialog: "Afbeeldingsvenster sluiten",
    dialogSuffix: "afbeeldingsvenster",
    images: [
      {
        src: heroBg,
        alt: "UCFM-leden zitten in een kring met open Bijbels tijdens een gezamenlijk gebed.",
        title: "De Heilige Kring",
        scripture:
          "Daarom: als iemand in Christus is, is hij een nieuwe schepping. Het oude is voorbijgegaan, zie, het nieuwe is gekomen. - 2 Korinthe 5:17",
        description:
          "Uw verleden bepaalt uw toekomst niet. Wij zetten ons in voor de reis van het veranderen van nullen in helden door de kracht en het doel te ontdekken die God in ieder van ons heeft gelegd. Ontdek het Woord met ons en vier het nieuwe leven dat wij vinden in aanbidding en dienstbaarheid.",
      },
      {
        src: congregation,
        alt: "Een brede blik op de UCFM-gemeente met opgeheven handen tijdens een zondagsdienst.",
        title: "Oprechte Aanbidding",
        description:
          "Met een stem van lofprijs, waar de aanwezigheid van God de harten van Zijn volk ontmoet.",
      },
      {
        src: generalOverseer,
        alt: "Rev. King Prosper staat op de preekstoel en spreekt tot de gemeente.",
        title: "Goddelijke Wijsheid",
        description:
          "Rev. King Prosper brengt een transformerende boodschap van hoop en doel vanaf de Mercy Ground-preekstoel.",
      },
      {
        src: worship,
        alt: "Aanbiddingsteam leidt intieme lofprijs tijdens Friday Absolute Worship.",
        title: "Diepe Aanbidding",
        description:
          "Een stil moment van geestelijke overgave geleid door het UCFM-aanbiddingsteam tijdens onze Friday Absolute Worship.",
      },
      {
        src: womensDay,
        alt: "UCFM-gemeenschap viert samen in Amsterdam.",
        title: "Viering",
        description:
          "Vrolijke glimlachen en gedeelde blijdschap tijdens een speciale UCFM-gemeenschapsviering in Amsterdam.",
      },
      {
        src: MenFellowship,
        alt: "Bijeenkomst van de mannenfellowship bij UCFM.",
        title: "Mannenfellowship",
        description: "Mannen komen samen voor fellowship, mentorschap en gebed.",
      },
      {
        src: GuestPreacher,
        alt: "Dr. Abel Damina deelt krachtige bijbelse waarheden.",
        title: "Gastprediker - Dr. Abel Damina",
        description:
          "Dr. Abel Damina deelt krachtige bijbelse waarheden tijdens een speciale gastbedieningssessie bij UCFM.",
      },
    ],
  },
} as const;

const GallerySection = () => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const { language } = useLanguage();
  const copy = content[language];
  const images = copy.images;

  useEffect(() => {
    if (lightbox !== null) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const closeBtn = document.getElementById("lightbox-close");
      closeBtn?.focus();

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightbox(null);
        if (e.key === "Tab") {
          const modal = document.getElementById("lightbox");
          if (!modal) return;
          const focusable = modal.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };

      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("keydown", onKey);
        previouslyFocused.current?.focus();
      };
    }
  }, [lightbox]);

  return (
    <section id="gallery" className="py-24 bg-cream" aria-labelledby="gallery-heading" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold-dark font-semibold uppercase tracking-[0.2em] text-sm mb-3">{copy.eyebrow}</p>
          <h2 id="gallery-heading" className="font-display text-3xl md:text-5xl font-bold text-navy-dark mb-4">
            {copy.title}
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto rounded-full" />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 bg-transparent rounded-2xl overflow-hidden shadow-2xl"
          aria-labelledby="hero-title"
        >
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <button
              onClick={() => setLightbox(0)}
              aria-label={`${images[0].title} (${copy.thumbnailSuffix})`}
              className="relative overflow-hidden group cursor-pointer focus-visible:ring-4 focus-visible:ring-gold-500 min-h-[44px]"
            >
              <img
                src={images[0].src}
                alt={images[0].alt}
                className="w-full h-full object-cover min-h-[280px] md:min-h-[380px] transform transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <span className="sr-only">{images[0].alt}</span>
            </button>

            <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-b from-transparent to-white/5">
              <h3 id="hero-title" className="text-xl md:text-2xl font-semibold text-navy-dark mt-3">
                {images[0].title}
              </h3>
              <p className="mt-3 text-navy-dark/80 italic">"{images[0].scripture}"</p>
              <p className="mt-4 text-navy-dark/80">{images[0].description}</p>
            </div>
          </div>
        </motion.article>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {images.slice(1, 10).map((image, i) => (
            <motion.div
              key={i}
              className="relative rounded-xl overflow-hidden bg-navy-dark/5"
              whileHover={{ translateY: -6 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <button
                onClick={() => setLightbox(i + 1)}
                aria-label={`${image.title} (${copy.thumbnailSuffix})`}
                className="group block text-left w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500"
                style={{ minHeight: 200 }}
              >
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 md:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center justify-center bg-white/20 p-2 rounded-full backdrop-blur-sm focus-visible:outline-none">
                      <Eye className="h-5 w-5 text-white" />
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-navy-dark">{image.title}</h3>
                  <p className="mt-2 text-sm text-navy-dark/80">{image.description}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            id="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-dark/95 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${images[lightbox].title} ${copy.dialogSuffix}`}
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0" aria-hidden />
            <div className="relative max-w-5xl w-full">
              <button
                id="lightbox-close"
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 text-white bg-black/30 p-2 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-500"
                aria-label={copy.closeDialog}
              >
                <X className="h-6 w-6" />
              </button>

              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                className="w-full max-h-[80vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />

              <div className="mt-4 bg-white/5 p-4 rounded-b-lg text-white">
                <h3 className="text-xl font-semibold">{images[lightbox].title}</h3>
                <p className="mt-2 text-white/90">{images[lightbox].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
