import { Facebook, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/lib/language";
import { siteConfig } from "@/lib/siteConfig";

const content = {
  en: {
    description: "A bible-believing church where Jesus is making the zeros to heroes.",
    quickLinks: "Quick Links",
    links: ["Home", "About", "Services", "Gallery", "Contact", "Give"],
    contact: "Contact Info",
    rights: "All rights reserved.",
  },
  nl: {
    description: "Een bijbelgetrouwe kerk waar Jezus nullen in helden verandert.",
    quickLinks: "Snelle Links",
    links: ["Home", "Over ons", "Diensten", "Galerij", "Contact", "Geven"],
    contact: "Contactgegevens",
    rights: "Alle rechten voorbehouden.",
  },
} as const;

const sectionIds = {
  Home: "home",
  About: "about",
  Services: "services",
  Gallery: "gallery",
  Contact: "contact",
  Give: "give",
  "Over ons": "about",
  Diensten: "services",
  Galerij: "gallery",
  Geven: "give",
} as const;

const Footer = () => {
  const { language } = useLanguage();
  const copy = content[language];

  function scrollToHash(hash: string) {
    if (!hash) return;
    const id = hash.startsWith("#") ? hash.slice(1) : hash;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  }

  return (
    <footer className="bg-navy-dark border-t border-gold/20 py-16" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-primary-foreground font-display font-bold text-sm">Universal Christian</p>
                <p className="text-gold font-display font-bold text-sm">Faith Ministry</p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              {copy.description}
            </p>
          </div>

          <div>
            <h3 className="text-gold font-display font-bold text-lg mb-4">{copy.quickLinks}</h3>
            <ul className="space-y-2">
              {copy.links.map((link) => (
                <li key={link}>
                  <a
                    href={`#${sectionIds[link]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const scrolled = scrollToHash(`#${sectionIds[link]}`);
                      if (!scrolled) window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-primary-foreground/60 hover:text-gold transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-display font-bold text-lg mb-4">{copy.contact}</h3>
            <ul className="space-y-3 text-primary-foreground/60 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Hettenheuvelweg 18, 1101BN, Amsterdam</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href={`tel:${siteConfig.contact.phoneHref}`} className="hover:text-gold transition-colors">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-gold transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-gold flex-shrink-0" />
                <a
                  href={siteConfig.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  {siteConfig.contact.facebookName}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold/10 text-center">
          <p className="text-primary-foreground/40 text-sm">
            Copyright {new Date().getFullYear()} Universal Christian Faith Ministry. {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
