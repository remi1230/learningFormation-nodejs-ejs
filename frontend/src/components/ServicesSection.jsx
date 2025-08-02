import { useEffect, useState } from "react";
import { fetchServices } from "../api";

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(console.error);
  }, []);

  return (
    <section className="flex flex-col mb-48">
      <div className="text-4xl font-bold text-primary mb-8">Services proposés</div>
      <div className="overflow-x-auto grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center">
        {services.map((service) => (
            <div key={service.name} className="card card-xs w-96 card-border border-info shadow-sm text-info">
            <div className="card-body items-center">
                <h2 className="card-title text-2xl text-info">{service.name}</h2>
                <p className="text-lg">{service.description}</p>
                <div className="justify-end card-actions text-base">
                <p>{service.detail}</p>
                </div>
            </div>
            </div>
        ))}
      </div>
    </section>
  );
}
