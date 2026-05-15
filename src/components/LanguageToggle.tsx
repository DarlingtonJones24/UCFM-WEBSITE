import { useLanguage } from "@/lib/language";

const labels = {
  en: {
    aria: "Select language",
  },
  nl: {
    aria: "Kies taal",
  },
} as const;

const LanguageToggle = ({ compact = false }: { compact?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const copy = labels[language];
  const options = [
    { value: "en", label: "EN", title: "English" },
    { value: "nl", label: "NL", title: "Nederlands" },
  ] as const;

  return (
    <div
      className={`inline-flex items-center rounded-full border border-gold/20 bg-primary-foreground/5 p-1 ${
        compact ? "w-full justify-center" : ""
      }`}
      role="group"
      aria-label={copy.aria}
    >
      {options.map((option) => {
        const isActive = language === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={isActive}
            title={option.title}
            className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
              isActive
                ? "bg-gold text-navy-dark"
                : "text-primary-foreground/70 hover:text-gold"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
