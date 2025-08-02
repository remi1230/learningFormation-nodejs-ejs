// src/pages/Home.jsx
import HeroSection from '../components/HeroSection.jsx';
import ServicesSection from '../components/ServicesSection.jsx';

export default function Home() {
  return (
    <div className="prose prose-2xl flex flex-col gap-24 text-center">
      <HeroSection />
      <ServicesSection />
    </div>
  );
}