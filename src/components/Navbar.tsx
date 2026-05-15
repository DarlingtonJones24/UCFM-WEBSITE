import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language";

const navLabels = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    give: "Give",
    navigation: "Main navigation",
    homeLabel: "UCFM Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  nl: {
    home: "Home",
    about: "Over ons",
    services: "Diensten",
    contact: "Contact",
    give: "Geven",
    navigation: "Hoofdnavigatie",
    homeLabel: "UCFM startpagina",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
  },
} as const;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const copy = navLabels[language];

  const navLinks = [
    { label: copy.home, href: "#home" },
    { label: copy.about, href: "#about" },
    { label: copy.services, href: "#services" },
    { label: copy.contact, href: "#contact" },
    { label: copy.give, href: "#give" },
  ];

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
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-gold/20"
      role="navigation"
      aria-label={copy.navigation}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-20 gap-4">
        <button
          onClick={() => {
            const scrolled = scrollToHash("home");
            if (!scrolled) window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3"
          aria-label={copy.homeLabel}
        >
          <img src={logo} alt="Universal Christian Faith Ministry logo" className="h-14 w-14 object-contain" />
          <div className="hidden sm:block">
            <p className="text-primary-foreground font-display text-sm font-bold leading-tight">
              Universal Christian
            </p>
            <p className="text-gold font-display text-sm font-bold leading-tight">
              Faith Ministry
            </p>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="px-4 py-2 text-sm font-body font-semibold uppercase tracking-wider text-primary-foreground/80 hover:text-gold transition-colors rounded-md focus-visible:outline-gold"
                  >
                    {link.label}
                  </Link>
                ) : link.href.startsWith("#") ? (
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(link.href);
                    }}
                    className="px-4 py-2 text-sm font-body font-semibold uppercase tracking-wider text-primary-foreground/80 hover:text-gold transition-colors rounded-md focus-visible:outline-gold"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 text-sm font-body font-semibold uppercase tracking-wider text-primary-foreground/80 hover:text-gold transition-colors rounded-md focus-visible:outline-gold"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <LanguageToggle />
        </div>

        <button
          className="lg:hidden text-primary-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? copy.closeMenu : copy.openMenu}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-dark border-t border-gold/20"
          >
            <div className="p-4 space-y-4">
              <LanguageToggle compact />
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-primary-foreground/80 hover:text-gold hover:bg-navy/50 rounded-md font-semibold uppercase tracking-wider text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToHash(link.href);
                          setIsOpen(false);
                        }}
                        className="block px-4 py-3 text-primary-foreground/80 hover:text-gold hover:bg-navy/50 rounded-md font-semibold uppercase tracking-wider text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 text-primary-foreground/80 hover:text-gold hover:bg-navy/50 rounded-md font-semibold uppercase tracking-wider text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
                <li className="mt-2">
                  <a
                    href="#give"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash("#give");
                      setIsOpen(false);
                    }}
                    className="block text-center bg-gold-gradient text-navy-dark font-bold text-sm px-6 py-3 rounded-md uppercase tracking-wider"
                  >
                    {copy.give}
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
