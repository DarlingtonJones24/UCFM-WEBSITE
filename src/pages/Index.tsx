import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import VideoSection from "@/components/VideoSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import GiveSection from "@/components/GiveSection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/lib/language";

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen">
      <a href="#main-content" className="skip-link">
        {language === "nl" ? "Ga naar de hoofdinhoud" : "Skip to main content"}
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <VideoSection />
        <GallerySection />
        <AboutSection />
        <ServicesSection />
        <GiveSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
