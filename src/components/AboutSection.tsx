import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Heart, Users, Globe } from "lucide-react";
import pastorPortrait from "@/assets/Pastor.jpeg";
import { useLanguage } from "@/lib/language";

const content = {
  en: {
    eyebrow: "About Us",
    title: "Where Zeros Become Heroes",
    body:
      "Universal Christian Faith Ministry is a vibrant, bible-believing church in the heart of Amsterdam. Under the leadership of Rev. King Prosper, our General Overseer, we are committed to spreading the gospel and transforming lives through the power of Jesus Christ.",
    imageAlt: "Rev. King Prosper seated with an open Bible",
    values: [
      {
        icon: BookOpen,
        title: "Bible-Based Teaching",
        description: "Our foundation is built on the Word of God, teaching sound biblical principles.",
      },
      {
        icon: Heart,
        title: "Love & Compassion",
        description: "We welcome all with open arms, showing the love of Christ to everyone.",
      },
      {
        icon: Users,
        title: "Community",
        description: "Building strong families and a vibrant church community in Amsterdam.",
      },
      {
        icon: Globe,
        title: "Global Mission",
        description: "Reaching nations with the gospel of Jesus Christ and transforming lives.",
      },
    ],
  },
  nl: {
    eyebrow: "Over Ons",
    title: "Waar Nullen Helden Worden",
    body:
      "Universal Christian Faith Ministry is een levendige, bijbelgetrouwe kerk in het hart van Amsterdam. Onder leiding van onze General Overseer, Rev. King Prosper, zetten wij ons in om het evangelie te verspreiden en levens te veranderen door de kracht van Jezus Christus.",
    imageAlt: "Rev. King Prosper zittend met een open Bijbel",
    values: [
      {
        icon: BookOpen,
        title: "Bijbels Onderwijs",
        description: "Ons fundament is gebouwd op het Woord van God en gezond bijbels onderwijs.",
      },
      {
        icon: Heart,
        title: "Liefde en Compassie",
        description: "Wij verwelkomen iedereen met open armen en tonen de liefde van Christus aan allen.",
      },
      {
        icon: Users,
        title: "Gemeenschap",
        description: "We bouwen aan sterke gezinnen en een levendige kerkgemeenschap in Amsterdam.",
      },
      {
        icon: Globe,
        title: "Wereldwijde Missie",
        description: "Wij bereiken naties met het evangelie van Jezus Christus en zien levens veranderen.",
      },
    ],
  },
} as const;

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const copy = content[language];

  return (
    <section id="about" className="py-24 bg-cream" aria-labelledby="about-heading">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold-dark font-semibold uppercase tracking-[0.2em] text-sm mb-3">{copy.eyebrow}</p>
          <h2 id="about-heading" className="font-display text-3xl md:text-5xl font-bold text-navy-dark mb-6">
            {copy.title}
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {copy.body}
          </p>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] xl:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[420px] justify-self-center rounded-[28px] border border-navy/10 bg-white p-4 shadow-navy"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-[22px] bg-[#f6f0f4]">
              <img
                src={pastorPortrait}
                alt={copy.imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {copy.values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md hover:border-gold/30 transition-all group"
              >
                <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
                  <item.icon className="h-6 w-6 text-gold group-hover:text-navy-dark transition-colors" />
                </div>
                <h3 className="font-display font-bold text-navy-dark text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
