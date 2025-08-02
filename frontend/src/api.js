// frontend/src/api.js

const API_URL = import.meta.env.VITE_API_URL;

export const fetchSchedules = async () => {
  const response = await fetch(`${API_URL}/schedules/json`);
  if (!response.ok) throw new Error("Erreur réseau");
  return await response.json();
};

export const fetchServices = async () => {
  const response = await fetch(`${API_URL}/services/json`);
  if (!response.ok) throw new Error("Erreur réseau");
  const payload = await response.json();
  return Array.isArray(payload.services) ? payload.services : [];
};

