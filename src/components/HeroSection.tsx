import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Clock, Facebook } from "lucide-react";
import familyImg from "@/assets/family in christ.jpeg";
import congregation from "@/assets/congregation.jpeg";
import worship from "@/assets/worship.jpeg";
import womensDay from "@/assets/womens-day.jpeg";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

interface Slide {
  bg: string;
  title: string;
  subtitle?: string;
  details: string[];
  highlight?: string;
  cta?: { label: string; href: string };
  imagePosition?: string;
}

const content = {
  en: {
    sectionLabel: "Welcome to Universal Christian Faith Ministry",
    pause: "Pause Carousel",
    resume: "Resume Carousel",
    prev: "Previous slide",
    next: "Next slide",
    indicator: "Slide indicators",
    newHere: "New here? Join us this Sunday in Amsterdam.",
    slides: [
      {
        bg: familyImg,
        title: "UNIVERSAL\nCHRISTIAN\nFAITH MINISTRY",
        subtitle: "A BIBLE-BELIEVING CHURCH\nIN AMSTERDAM",
        details: [`SUNDAY VICTORY SERVICE - ${siteConfig.services.sunday.time}`],
        highlight: siteConfig.services.location,
        cta: { label: "Join Us This Sunday", href: "#services" },
        imagePosition: "center 28%",
      },
      {
        bg: congregation,
        title: "FRIDAY\nSERVICE",
        subtitle: "GROW DEEPER IN THE WORD\nAND IN PRAYER WITH US",
        details: [`FRIDAY - ${siteConfig.services.friday.time}`],
        highlight: "Where Jesus is making the zeros to heroes",
        cta: { label: "Learn More", href: "#about" },
        imagePosition: "center 68%",
      },
      {
        bg: worship,
        title: "ABSOLUTE\nWORSHIP",
        subtitle: "A NIGHT OF POWERFUL\nWORSHIP & PRAISE",
        details: [`EVERY 1ST FRIDAY - ${siteConfig.services.firstFriday.time}`],
        highlight: "Come as you are, leave transformed",
        cta: { label: "Contact Us", href: "#contact" },
        imagePosition: "center 42%",
      },
      {
        bg: womensDay,
        title: "CONNECT\nWITH\nUS",
        subtitle: "REACH OUT AND BECOME\nPART OF OUR FAMILY",
        details: [
          `PHONE: ${siteConfig.contact.phoneDisplay}`,
          `WHATSAPP: ${siteConfig.contact.phoneDisplay}`,
          `Email:\n${siteConfig.contact.email}`,
        ],
        highlight: `Facebook: ${siteConfig.contact.facebookName}`,
        cta: { label: "Give Online", href: "#give" },
        imagePosition: "center 32%",
      },
    ] satisfies Slide[],
  },
  nl: {
    sectionLabel: "Welkom bij Universal Christian Faith Ministry",
    pause: "Carrousel pauzeren",
    resume: "Carrousel hervatten",
    prev: "Vorige dia",
    next: "Volgende dia",
    indicator: "Dia-indicatoren",
    newHere: "Nieuw hier? Kom zondag met ons mee in Amsterdam.",
    slides: [
      {
        bg: familyImg,
        title: "UNIVERSAL\nCHRISTIAN\nFAITH MINISTRY",
        subtitle: "EEN BIJBELGETROUWE KERK\nIN AMSTERDAM",
        details: [`ZONDAG OVERWINNINGSDIENST - ${siteConfig.services.sunday.time}`],
        highlight: siteConfig.services.location,
        cta: { label: "Kom Deze Zondag", href: "#services" },
        imagePosition: "center 28%",
      },
      {
        bg: congregation,
        title: "VRIJDAG\nDIENST",
        subtitle: "GROEI DIEPER IN HET WOORD\nEN IN GEBED MET ONS MEE",
        details: [`VRIJDAG - ${siteConfig.services.friday.time}`],
        highlight: "Waar Jezus nullen in helden verandert",
        cta: { label: "Meer Informatie", href: "#about" },
        imagePosition: "center 68%",
      },
      {
        bg: worship,
        title: "ABSOLUTE\nAANBIDDING",
        subtitle: "EEN AVOND VAN KRACHTIGE\nAANBIDDING EN LOFPRIJS",
        details: [`ELKE 1E VRIJDAG - ${siteConfig.services.firstFriday.time}`],
        highlight: "Kom zoals je bent en vertrek veranderd",
        cta: { label: "Neem Contact Op", href: "#contact" },
        imagePosition: "center 42%",
      },
      {
        bg: womensDay,
        title: "VERBIND\nMET\nONS",
        subtitle: "NEEM CONTACT OP EN WORD\nONDERDEEL VAN ONZE FAMILIE",
        details: [
          `TELEFOON: ${siteConfig.contact.phoneDisplay}`,
          `WHATSAPP: ${siteConfig.contact.phoneDisplay}`,
          `E-mail:\n${siteConfig.contact.email}`,
        ],
        highlight: `Facebook: ${siteConfig.contact.facebookName}`,
        cta: { label: "Online Geven", href: "#give" },
        imagePosition: "center 32%",
      },
    ] satisfies Slide[],
  },
} as const;

const HeroSection = () => {
  const { language } = useLanguage();
  const copy = content[language];
  const slides = copy.slides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label={copy.sectionLabel}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.bg}
            alt=""
            role="presentation"
            className="h-full w-full object-cover"
            style={{ objectPosition: slide.imagePosition ?? "center center" }}
          />
          <div className="absolute inset-0 bg-navy-dark/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/70 via-navy-dark/30 to-navy-dark/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/45 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-20 sm:pt-32 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${language}-${current}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-[46rem] rounded-2xl border border-white/12 bg-navy-dark/42 px-5 py-7 shadow-2xl backdrop-blur-[6px] sm:mx-0 sm:rounded-[32px] sm:px-8 sm:py-10 md:px-10 lg:px-12"
          >
            <h1 className="mb-5 max-w-[12ch] whitespace-pre-line [text-wrap:balance] font-display text-[2.85rem] font-black uppercase leading-[0.92] text-primary-foreground drop-shadow-[0_14px_28px_rgba(0,0,0,0.32)] min-[390px]:text-[3.15rem] sm:mb-6 sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5rem]">
              {slide.title}
            </h1>

            {current === 0 && (
              <p className="mb-4 inline-flex max-w-full rounded-full bg-gold/20 px-4 py-2 text-xs font-bold uppercase leading-snug tracking-[0.08em] text-gold sm:text-sm">
                {copy.newHere}
              </p>
            )}

            {slide.subtitle && (
              <p className="mb-5 max-w-[30ch] whitespace-pre-line [overflow-wrap:anywhere] [text-wrap:balance] font-body text-sm uppercase leading-relaxed tracking-[0.04em] text-primary-foreground/90 sm:mb-6 sm:max-w-[36ch] sm:text-base md:text-lg">
                {slide.subtitle}
              </p>
            )}

            <div className="mb-6 space-y-2">
              {slide.details.map((detail, i) => (
                <p
                  key={i}
                  className={`whitespace-pre-line text-gold [overflow-wrap:anywhere] ${
                    detail.includes("@")
                      ? "max-w-[24ch] font-body text-base font-semibold leading-snug text-primary-foreground sm:max-w-[28ch] sm:text-lg md:text-xl"
                      : "font-display text-base font-bold uppercase tracking-[0.08em] sm:text-xl md:text-2xl"
                  }`}
                >
                  {detail}
                </p>
              ))}
            </div>

            {slide.highlight && (
              <p className="mb-8 flex max-w-[34ch] items-start gap-2 break-words font-body text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                {current === 0 && <MapPin className="h-5 w-5 text-gold shrink-0" />}
                {current === 3 && <Facebook className="h-5 w-5 text-gold shrink-0" />}
                {current !== 0 && current !== 3 && <Clock className="h-5 w-5 text-gold shrink-0" />}
                {slide.highlight}
              </p>
            )}

            {slide.cta && (
              <a
                href={slide.cta.href}
                className="inline-block w-full rounded-md bg-gold-gradient px-6 py-4 text-center text-base font-bold uppercase tracking-wider text-navy-dark transition-all hover:shadow-gold sm:w-auto sm:px-8 sm:text-lg"
              >
                {slide.cta.label}
              </a>
            )}

            <div className="mt-6 hidden sm:block">
              <button
                onClick={() => setIsPaused((p) => !p)}
                aria-pressed={isPaused}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-primary-foreground/10 px-4 py-2 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              >
                {isPaused ? copy.resume : copy.pause}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-primary-foreground/10 p-3 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20 focus-visible:outline-gold sm:block"
        aria-label={copy.prev}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-primary-foreground/10 p-3 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20 focus-visible:outline-gold sm:block"
        aria-label={copy.next}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3" role="tablist" aria-label={copy.indicator}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`${copy.indicator} ${i + 1}`}
            className={`h-3 rounded-full transition-all duration-300 ${
              i === current ? "w-10 bg-gold" : "w-3 bg-primary-foreground/40 hover:bg-primary-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
