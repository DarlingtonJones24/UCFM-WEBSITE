import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Facebook, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

const content = {
  en: {
    eyebrow: "Get In Touch",
    title: "Contact Us",
    location: "Our Location",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    mapTitle: "UCFM Amsterdam location on Google Maps",
    directions: "Get Directions",
    visitNote: "We meet in Amsterdam Zuidoost. Tap the address or button for directions.",
  },
  nl: {
    eyebrow: "Neem Contact Op",
    title: "Contact",
    location: "Onze Locatie",
    phone: "Telefoon",
    email: "E-mail",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    mapTitle: "Locatie van UCFM Amsterdam op Google Maps",
    directions: "Route Openen",
    visitNote: "Wij komen samen in Amsterdam Zuidoost. Tik op het adres of de knop voor de route.",
  },
} as const;

const churchAddress = "Hettenheuvelweg 18, 1101 BN Amsterdam";
const encodedChurchAddress = encodeURIComponent(churchAddress);
const churchMapEmbedUrl = `https://www.google.com/maps?q=${encodedChurchAddress}&output=embed&z=17`;
const churchDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedChurchAddress}`;

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <section id="contact" className="py-24 bg-background" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold-dark font-semibold uppercase tracking-[0.2em] text-sm mb-3">{copy.eyebrow}</p>
          <h2 id="contact-heading" className="font-display text-3xl md:text-5xl font-bold text-navy-dark mb-6">
            {copy.title}
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark text-lg">{copy.location}</h3>
                <a
                  href={churchDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {churchAddress}
                </a>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">{copy.visitNote}</p>
                <a
                  href={churchDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-md bg-gold-gradient px-5 py-3 text-sm font-bold uppercase tracking-wider text-navy-dark transition-all hover:shadow-gold"
                >
                  {copy.directions}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark text-lg">{copy.phone}</h3>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark text-lg">{copy.email}</h3>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-muted-foreground hover:text-gold transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark text-lg">{copy.whatsapp}</h3>
                <a
                  href={siteConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Facebook className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark text-lg">{copy.facebook}</h3>
                <a
                  href={siteConfig.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  {siteConfig.contact.facebookName}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-xl overflow-hidden shadow-navy border border-border h-[400px]"
          >
            <iframe
              title={copy.mapTitle}
              src={churchMapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
