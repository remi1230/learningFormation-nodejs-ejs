export function toYMD(input) {
  // déjà au bon format ?
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  // sinon, on normalise (timezone-safe)
  const d = new Date(input);
  if (isNaN(d)) return '';
  const utc = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return utc.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function formatFR(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return '';
  const [y, m, d] = ymd.split('-');
  return `${d}/${m}/${y}`; // 'DD/MM/AAAA'
}

export function formatFRLong(ymd) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return '';
  
  const [y, m, d] = ymd.split('-');
  const date = new Date(y, m - 1, d);

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function diffYMD(fromDateStr) {
  const from = new Date(fromDateStr);
  const now = new Date();

  let years = now.getFullYear() - from.getFullYear();
  let months = now.getMonth() - from.getMonth();
  let days = now.getDate() - from.getDate();

  // Ajustement si le jour est négatif
  if (days < 0) {
    // Reculer d'un mois
    months--;
    // Nombre de jours dans le mois précédent
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // Ajustement si le mois est négatif
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}