import MapCabinet from "./ui-kit/MapCabinet";

export default function MapCabinetSection() {
  return (
    <section>
      <h1 className="text-4xl font-bold">Nous trouver</h1>
      <MapCabinet
        lat={47.0810}
        lng={2.3988}
        label="Cabinet dentaire XYZ"
      />
      <a
        className="link text-lg mt-12"
        href="https://maps.google.com/?q=Cabinet+dentaire+XYZ"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ouvrir dans Google Maps
      </a>
    </section>
  );
}