// src/pages/Home.jsx
import HeroSection from '../components/HeroSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx'
import NewsSection from '../components/NewsSection.jsx'
import CabinetMapsSection from '../components/CabinetMapsSection.jsx'
import SchedulesSection from '../components/SchedulesSection.jsx'
import ContactSection from '../components/ContactSection.jsx'

export default function Home() {
  return (
    <div className="prose prose-2xl flex flex-col gap-48 mb-64 text-center">
      <HeroSection />
      <ServicesSection />
      <NewsSection />
      <CabinetMapsSection />
      <SchedulesSection title="Horaires d'ouverture" size="4xl" marginBottom="0" />
      <ContactSection />
    </div>
  );
}