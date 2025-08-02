// src/components/AutoCarousel.jsx
import { useState, useEffect, useRef } from "react";

const modules = import.meta.glob("../../assets/images/caroussel/*.{png,jpg,webp}", {
  eager: true,
  as: "url",
});
const images = Object.values(modules);

export default function Caroussel({ interval = 3000 }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = (active + 1) % images.length;
      setActive(next);

      // On scroll horizontal dans le container, pas la fenêtre
      const container = containerRef.current;
      if (container) {
        const slideWidth = container.clientWidth;
        container.scrollTo({
          left: slideWidth * next,
          behavior: "smooth",
        });
      }
    }, interval);
    return () => clearTimeout(timer);
  }, [active, interval]);

  return (
    <div
      ref={containerRef}
      className="carousel w-full overflow-x-auto no-scrollbar rounded-lg"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="carousel-item flex-shrink-0 w-full rounded-lg overflow-hidden"
          style={{ scrollSnapAlign: "start" }}
        >
          <img src={src} className="w-full object-cover rounded-lg overflow-hidden" />
        </div>
      ))}
    </div>
  );
}