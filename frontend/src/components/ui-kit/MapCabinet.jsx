// src/components/MapCabinet.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, StreetViewPanorama, useLoadScript } from "@react-google-maps/api";

// Vite
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// CRA : const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = { width: "100%", height: "480px" };

export default function MapCabinet({
  lat = 47.0810,
  lng = 2.3988,
  zoom = 15,
  label = "Cabinet dentaire",
  showStreetViewToggle = true,
}) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const [streetView, setStreetView] = useState(false);

  // on garde une ref sur l'instance de la map et sur le marker avancé
  const mapRef = useRef(null);
  const advMarkerRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    // libraries: ["geometry","drawing"], // si besoin de mesures/outils
  });

  // (Re)crée / monte le AdvancedMarker quand la map est prête et que l’on est en vue "carte"
  useEffect(() => {
    if (!isLoaded || !mapRef.current || streetView) {
      // si on passe en StreetView, on détache le marker (propre)
      if (advMarkerRef.current) {
        advMarkerRef.current.map = null;
      }
      return;
    }

    const map = mapRef.current;

    // Option: joli pin avec lib "marker"
    // (AdvancedMarkerElement et PinElement font partie de google.maps.marker)
    const pin = new google.maps.marker.PinElement({
      glyph: label?.[0]?.toUpperCase() || "•",
      glyphColor: "#fff",
      background: "#2563eb", // bleu Tailwind 600-ish
      borderColor: "#1e40af",
      scale: 1.1,
    });

    // Détruit l’ancien si on re-crée
    if (advMarkerRef.current) {
      advMarkerRef.current.map = null;
      advMarkerRef.current = null;
    }

    advMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: center,
      title: label,
      content: pin.element, // remplace le marqueur "classique"
    });

    // Cleanup si le composant unmount
    return () => {
      if (advMarkerRef.current) {
        advMarkerRef.current.map = null;
        advMarkerRef.current = null;
      }
    };
  }, [isLoaded, center, label, streetView]);

  if (loadError) {
    return (
      <div className="p-4 border rounded-md text-red-600">
        Erreur de chargement de Google Maps. Vérifie ta clé API et les restrictions.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="skeleton w-full h-[480px] rounded-xl" />;
  }

  return (
    <div className="rounded-xl overflow-hidden shadow">
      {showStreetViewToggle && (
        <div className="flex justify-end p-2 bg-base-200">
          <button
            className="btn btn-sm"
            onClick={() => setStreetView((v) => !v)}
            aria-pressed={streetView}
          >
            {streetView ? "Voir la carte" : "Street View"}
          </button>
        </div>
      )}

      <GoogleMap
        onLoad={(map) => (mapRef.current = map)}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          fullscreenControl: false,
          streetViewControl: false, // on gère nous-mêmes le toggle
          mapTypeControl: false,
          gestureHandling: "cooperative",
          clickableIcons: false,
        }}
      >
        {streetView && (
          <StreetViewPanorama
            position={center}
            visible
            options={{
              pov: { heading: 0, pitch: 0 },
              zoom: 1,
              addressControl: false,
              linksControl: true,
              panControl: true,
              enableCloseButton: false,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}