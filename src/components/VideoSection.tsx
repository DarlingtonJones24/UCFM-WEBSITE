import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, PlayCircle } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

type ServiceMedia = {
  channelUrl: string;
  checkedAt: string;
  latestEmbedUrl: string;
  latestServicePublishedAt: string | null;
  latestServiceTitle: string | null;
  latestWatchUrl: string;
  liveEmbedUrl: string;
  liveNow: boolean;
  liveTitle: string | null;
  liveUrl: string;
  source: string;
};

const copyByLanguage = {
  en: {
    watchLive: "Watch Live",
    latestService: "Latest Service",
    liveHeading: "Join Our Live Service",
    latestHeading: "Watch Our Latest Service",
    liveNow: "Live now",
    liveReady: "Live page ready",
    latestBadge: "Latest service",
    watchLatest: "Watch Latest Service",
    noLivePrefix: "No live broadcast is active right now. Switch to",
    noLiveAction: "Latest Service",
    noLiveSuffix: "or open the YouTube live page to see the next scheduled stream.",
    openChannel: "Open Channel on YouTube",
    openService: "Open Service on YouTube",
    openLive: "Open Live Page on YouTube",
    youtubeOnly: "This service is available on YouTube.",
    synced: "Latest service is synced from YouTube automatically.",
    fallback: "Using the live channel page and uploads playlist fallback.",
    fallbackSummary: "This player follows the channel's latest service content automatically.",
    liveSummary: `Join us every Sunday at ${siteConfig.services.sunday.shortTime} Amsterdam time. If the stream has not started yet, open the YouTube live page.`,
  },
  nl: {
    watchLive: "Live Kijken",
    latestService: "Laatste Dienst",
    liveHeading: "Doe Mee Met Onze Live Dienst",
    latestHeading: "Bekijk Onze Laatste Dienst",
    liveNow: "Nu live",
    liveReady: "Livepagina klaar",
    latestBadge: "Laatste dienst",
    watchLatest: "Bekijk Laatste Dienst",
    noLivePrefix: "Er is nu geen live-uitzending. Schakel over naar",
    noLiveAction: "Laatste Dienst",
    noLiveSuffix: "of open de YouTube-livepagina om de volgende geplande stream te zien.",
    openChannel: "Open Kanaal op YouTube",
    openService: "Open Dienst op YouTube",
    openLive: "Open Livepagina op YouTube",
    youtubeOnly: "Deze dienst is beschikbaar op YouTube.",
    synced: "De laatste dienst wordt automatisch gesynchroniseerd vanaf YouTube.",
    fallback: "De livepagina en uploads-afspeellijst worden als fallback gebruikt.",
    fallbackSummary: "Deze speler volgt automatisch de nieuwste dienst op het kanaal.",
    liveSummary: `Doe elke zondag om ${siteConfig.services.sunday.shortTime} mee, Amsterdamse tijd. Als de stream nog niet is gestart, open dan de YouTube-livepagina.`,
  },
} as const;

const fallbackServiceMedia: ServiceMedia = {
  channelUrl: siteConfig.media.youtubeChannelUrl,
  checkedAt: new Date().toISOString(),
  latestEmbedUrl: `https://www.youtube.com/embed/${siteConfig.media.latestServiceVideoId}?rel=0`,
  latestServicePublishedAt: null,
  latestServiceTitle: siteConfig.media.latestServiceTitle,
  latestWatchUrl: `https://www.youtube.com/watch?v=${siteConfig.media.latestServiceVideoId}`,
  liveEmbedUrl: `https://www.youtube.com/embed/live_stream?channel=${siteConfig.media.youtubeChannelId}`,
  liveNow: false,
  liveTitle: null,
  liveUrl: siteConfig.media.youtubeLiveUrl,
  source: "fallback",
};

const WatchLiveSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [serviceMedia, setServiceMedia] = useState<ServiceMedia>(fallbackServiceMedia);
  const { language } = useLanguage();
  const copy = copyByLanguage[language];

  useEffect(() => {
    let mounted = true;

    fetch(apiUrl("/service-media"))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load service media");
        }
        return response.json();
      })
      .then((data) => {
        if (!mounted) {
          return;
        }
        setServiceMedia({
          ...fallbackServiceMedia,
          ...data,
        });
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setServiceMedia(fallbackServiceMedia);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const latestPublishedLabel = serviceMedia.latestServicePublishedAt
    ? new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Amsterdam",
      }).format(new Date(serviceMedia.latestServicePublishedAt))
    : null;
  const activeHeading = serviceMedia.liveNow ? copy.liveHeading : copy.latestHeading;
  const activeSummary = serviceMedia.liveNow
    ? serviceMedia.liveTitle || copy.liveSummary
    : serviceMedia.latestServiceTitle || siteConfig.media.latestServiceTitle;
  const latestSummary = serviceMedia.latestServiceTitle || siteConfig.media.latestServiceTitle;
  const primaryUrl = serviceMedia.liveNow ? serviceMedia.liveUrl : serviceMedia.latestWatchUrl;
  const latestThumbnailUrl = `https://i.ytimg.com/vi/${siteConfig.media.latestServiceVideoId}/hqdefault.jpg`;

  return (
    <section id="watch-live" className="py-16 bg-[#800000] sm:py-24" aria-labelledby="live-heading">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2
            id="live-heading"
            className="font-display text-3xl md:text-5xl font-bold text-[#D4AF37] mb-4"
          >
            {activeHeading}
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-base leading-relaxed sm:text-lg">
            {activeSummary}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2 text-white/80">
              {serviceMedia.liveNow ? copy.liveNow : copy.latestBadge}
            </span>
            {!serviceMedia.liveNow && latestPublishedLabel && (
              <span className="rounded-full bg-[#D4AF37]/15 px-4 py-2 text-[#f3d886]">
                {latestPublishedLabel}
              </span>
            )}
            <span className="rounded-full bg-white/10 px-4 py-2 text-white/60">
              {language === "nl" ? "Zondag" : "Sunday"} {siteConfig.services.sunday.time}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="overflow-hidden rounded-lg border-2 border-[#D4AF37] shadow-2xl sm:rounded-xl">
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {serviceMedia.liveNow ? (
                <iframe
                  src={serviceMedia.liveEmbedUrl}
                  title={copy.liveHeading}
                  width="100%"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={serviceMedia.latestWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 group block w-full"
                  aria-label={copy.watchLatest}
                >
                  <img
                    src={latestThumbnailUrl}
                    alt={latestSummary}
                    className="h-full w-full object-contain opacity-80 transition-opacity group-hover:opacity-95 sm:object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 px-6 text-center">
                    <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-[#800000] shadow-2xl transition-transform group-hover:scale-105 sm:mb-4 sm:h-20 sm:w-20">
                      <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10" />
                    </span>
                    <p className="max-w-2xl text-base font-bold leading-snug text-white sm:text-lg md:text-2xl">
                      {latestSummary}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-white/80 sm:mt-3 sm:text-sm">
                      {copy.youtubeOnly}
                    </p>
                    <span className="mt-4 rounded-md bg-[#D4AF37] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#800000] sm:mt-5 sm:px-6 sm:text-sm">
                      {copy.openService}
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {!serviceMedia.liveNow && (
            <p className="text-center text-white/50 text-sm mt-4">
              {copy.liveSummary}
            </p>
          )}

          <div className="text-center mt-8">
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#D4AF37] px-5 py-4 text-base font-bold uppercase tracking-wider text-[#800000] transition-colors hover:bg-[#e8c84a] sm:w-auto sm:px-8 sm:text-lg"
            >
              {serviceMedia.liveNow ? copy.openLive : copy.openService}
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>

          {!serviceMedia.liveNow && (
            <div className="mt-4 text-center">
              <a
                href={serviceMedia.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white/55 underline underline-offset-4 transition-colors hover:text-[#D4AF37]"
              >
                {copy.openLive}
              </a>
            </div>
          )}

          <p className="mt-4 text-center text-white/40 text-xs uppercase tracking-wider">
            {serviceMedia.source === "youtube_api" || serviceMedia.source === "youtube_rss"
              ? copy.synced
              : copy.fallback}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WatchLiveSection;
