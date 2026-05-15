import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";
import peopleOfGod from "@/assets/PeopleOfGod.jpeg";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

const content = {
  en: {
    eyebrow: "Worship With Us",
    title: "Service Schedule",
    intro: "Plan your visit around the main weekly gatherings.",
    directions: "Get Directions",
    description:
      "Weekly service schedule and times. Use tab to focus individual service cards for details.",
    services: [
      { day: "Sunday", name: "Victory Service", time: siteConfig.services.sunday.time, icon: Calendar, featured: true },
      { day: "Friday", name: "Friday Service", time: siteConfig.services.friday.time, icon: Clock },
      { day: "1st Friday", name: "Absolute Worship", time: siteConfig.services.firstFriday.time, icon: Calendar },
      { day: "3rd Friday", name: "All Night Service", time: siteConfig.services.thirdFriday.time, icon: Clock },
    ],
  },
  nl: {
    eyebrow: "Aanbid Met Ons",
    title: "Dienstenrooster",
    intro: "Plan uw bezoek rond onze belangrijkste wekelijkse samenkomsten.",
    directions: "Route Openen",
    description:
      "Wekelijks overzicht van onze diensten en tijden. Gebruik tab om elke dienstkaart te openen.",
    services: [
      { day: "Zondag", name: "Overwinningsdienst", time: siteConfig.services.sunday.time, icon: Calendar, featured: true },
      { day: "Vrijdag", name: "Vrijdagdienst", time: siteConfig.services.friday.time, icon: Clock },
      { day: "1e Vrijdag", name: "Absolute Worship", time: siteConfig.services.firstFriday.time, icon: Calendar },
      { day: "3e Vrijdag", name: "Nachtwake", time: siteConfig.services.thirdFriday.time, icon: Clock },
    ],
  },
} as const;

const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  siteConfig.services.location
)}`;

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <section
      id="services"
      className="relative py-24 bg-navy-gradient"
      aria-labelledby="services-heading"
      role="region"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${peopleOfGod})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-navy-dark/85" aria-hidden="true" />

      <div className="relative container mx-auto px-4" ref={ref}>
        <p id="services-desc" className="sr-only">
          {copy.description}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold font-semibold uppercase tracking-[0.2em] text-sm mb-3">{copy.eyebrow}</p>
          <h2 id="services-heading" className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            {copy.title}
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6 rounded-full" />
          <p className="mx-auto max-w-2xl text-primary-foreground/70 text-lg">
            {copy.intro}
          </p>
        </motion.div>

        <ul className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-6xl mx-auto" role="list" aria-describedby="services-desc">
          {copy.services.map((service, i) => {
            const titleId = `service-title-${i}`;
            return (
              <li key={service.day}>
                <motion.article
                  id={`service-${i}`}
                  aria-labelledby={titleId}
                  tabIndex={0}
                  role="article"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                  className={`backdrop-blur-sm border rounded-xl p-8 text-center hover:border-gold/50 transition-all group focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/30 focus-visible:ring-offset-2 ${
                    "featured" in service && service.featured
                      ? "bg-gold/15 border-gold/60"
                      : "bg-primary-foreground/5 border-gold/20"
                  }`}
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/20 transition-colors">
                    <service.icon className="h-7 w-7 text-gold" aria-hidden="true" />
                  </div>
                  <h3 id={titleId} className="font-display text-gold text-xl font-bold mb-2">
                    {service.day}
                  </h3>
                  <p className="text-primary-foreground font-semibold mb-2">{service.name}</p>
                  <p className="text-primary-foreground/60 text-sm">{service.time}</p>
                </motion.article>
              </li>
            );
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 text-center text-primary-foreground/70 sm:flex-row"
        >
          <div className="flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-gold" />
            <p className="font-body">{siteConfig.services.location}</p>
          </div>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gold-gradient px-5 py-3 text-sm font-bold uppercase tracking-wider text-navy-dark transition-all hover:shadow-gold"
          >
            {copy.directions}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
