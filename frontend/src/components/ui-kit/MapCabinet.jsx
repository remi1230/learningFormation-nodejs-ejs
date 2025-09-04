// src/components/MapCabinet.jsx
import { useMemo, useRef, useState } from "react";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const CONTAINER_STYLE = { width: "100%", height: "480px" };
const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_ID_STYLE;

export default function MapCabinet({
  lat = 47.0810,
  lng = 2.3988,
  zoom = 15,
  title = "Cabinet dentaire du Dr Dubois",
}) {
  const center = useMemo(() => ({ lat, lng }), [lat, lng]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    version: "weekly",
    id: "google-map-script",
  });

  async function onMapLoad(map) {
    mapRef.current = map;

    // 1) Charger la lib "marker" de manière fiable
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

    // 2) Nettoyage si on re-crée
    if (markerRef.current) {
      markerRef.current.map = null;
      markerRef.current = null;
    }

    // 3) Pin par défaut (pas de HTML custom pour l’instant)
    const pin = new PinElement({
      glyph: title?.[0]?.toUpperCase() || "•",
      glyphColor: "#fff",
      background: "#2563eb",
      borderColor: "#1e40af",
      scale: 1.1,
    });

    // 4) Création du repère avancé
    const adv = new AdvancedMarkerElement({
      map,
      position: center,
      title: String(title || ""),
      content: pin.element,
      zIndex: 999999,
      collisionBehavior: "REQUIRED", // le plus “visible” possible
    });

    adv.addListener("click", () => setInfoOpen(true));
    markerRef.current = adv;

    // petite vérif visuelle : recenter/zoom
    map.setCenter(center);
    map.setZoom(zoom);
  }

  if (loadError) return <div className="p-4 text-red-600">Erreur de chargement Google Maps.</div>;
  if (!isLoaded) return <div className="skeleton w-full h-[480px] rounded-xl" />;

  return (
    <div className="overflow-hidden shadow-lg rounded-md border">
      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={CONTAINER_STYLE}
        center={center}
        zoom={zoom}
        options={{
          mapId: MAP_ID,            // tu peux TEMPORAIREMENT l’enlever pour tester
          fullscreenControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          gestureHandling: "cooperative",
          clickableIcons: true,
        }}
      >
        {infoOpen && (
          <InfoWindow position={center} onCloseClick={() => setInfoOpen(false)}>
            <div>
              <strong>{title}</strong>
              <div>{lat.toFixed(4)}, {lng.toFixed(4)}</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}