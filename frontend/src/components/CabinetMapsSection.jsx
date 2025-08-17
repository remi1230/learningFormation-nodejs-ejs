import MapCabinet from "./ui-kit/MapCabinet";

export default function MapCabinetSection() {
  return (
    <section>
      <h1 className="text-4xl font-bold">Nous trouver</h1>
      <h1 className="text-xl font-medium">Nous sommes situés au 12 rue des Aubépines</h1>
      <MapCabinet
        lat={47.0810}
        lng={2.3988}
        title={
          <div className="flex flex-col items-center">
            <div className="leading-[0.4] text-gray-800">
              <p>Cabinet dentaire du docteur Dubois</p>
              <p>12, rue des Aubépines</p>
              <p>18000 Bourges</p>
            </div>
            
            <img className="w-40 h-40" src="/img/clinic/clinic.webp" alt="Cabinet dentaire du docteur Dupont" />
          </div>
        }
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