import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const themes = [
  { value: "light",        label: "Light",        color: "#ffffff" },       // Blanc
  { value: "dark",         label: "Dark",         color: "#1f2937" },       // Gris foncé
  { value: "cupcake",      label: "Cupcake",      color: "#f9fafb" },       // Rose pâle
  { value: "bumblebee",    label: "Bumblebee",    color: "#fef3c7" },       // Jaune doux
  { value: "emerald",      label: "Emerald",      color: "#ecfdf5" },       // Vert très clair
  { value: "corporate",    label: "Corporate",    color: "#f5f6f9" },       // Bleu-gris clair
  { value: "synthwave",    label: "Synthwave",    color: "#2d1b69" },       // Violet foncé
  { value: "retro",        label: "Retro",        color: "#e4d8c3" },       // Beige rétro
  { value: "cyberpunk",    label: "Cyberpunk",    color: "#0f172a" },       // Bleu nuit
  { value: "valentine",    label: "Valentine",    color: "#fdf2f8" },       // Rose très clair
  { value: "halloween",    label: "Halloween",    color: "#1e293b" },       // Bleu-gris très foncé
  { value: "garden",       label: "Garden",       color: "#e7f5df" },       // Vert pastel
  { value: "forest",       label: "Forest",       color: "#1a2e05" },       // Vert foncé
  { value: "aqua",         label: "Aqua",         color: "#e0fdfa" },       // Cyan pastel
  { value: "lofi",         label: "Lofi",         color: "#f2f2f2" },       // Gris clair (lofi minimal)
  { value: "pastel",       label: "Pastel",       color: "#fdf1f9" },       // Rose très clair
  { value: "fantasy",      label: "Fantasy",      color: "#f0e5ff" },       // Violet pastel
  { value: "wireframe",    label: "Wireframe",    color: "#ffffff" },       // Blanc (très neutre)
  { value: "black",        label: "Black",        color: "#000000" },       // Noir
  { value: "luxury",       label: "Luxury",       color: "#111111" },       // Gris anthracite
  { value: "dracula",      label: "Dracula",      color: "#282a36" },       // Violet sombre
  { value: "cmyk",         label: "CMYK",         color: "#ffffff" },       // Blanc (couleurs vives en accent)
  { value: "autumn",       label: "Autumn",       color: "#fdf6e3" },       // Beige chaud
  { value: "business",     label: "Business",     color: "#f0f3f8" },       // Gris professionnel
  { value: "acid",         label: "Acid",         color: "#fcf7de" },       // Jaune-vert très clair
  { value: "lemonade",     label: "Lemonade",     color: "#fef9c3" },       // Jaune citron
  { value: "night",        label: "Night",        color: "#0f172a" },       // Bleu nuit profond
  { value: "coffee",       label: "Coffee",       color: "#2e1a14" },       // Marron foncé
  { value: "winter",       label: "Winter",       color: "#e0f2fe" },       // Bleu clair froid
  { value: "dim",          label: "Dim",          color: "#1e1e2f" },       // Violet-noir
  { value: "nord",         label: "Nord",         color: "#2e3440" },       // Bleu arctique foncé
  { value: "sunset",       label: "Sunset",       color: "#ffe4e6" },       // Rose orangé doux
  { value: "caramellatte", label: "Caramellatte", color: "#faf1e4" },       // Caramel très clair
  { value: "abyss",        label: "Abyss",        color: "#0a0f19" },       // Bleu nuit profond
  { value: "silk",         label: "Silk",         color: "#f4f2ed" },       // Ivoire doux
  { value: "default",      label: "Default",      color: "#ffffff" },       // Par défaut = light
];

const defaultTheme = localStorage.getItem("theme") || "corporate";

export default function ThemeController() {
  const [theme, setTheme] = useState(
    () => defaultTheme
  );

  // Appliquer thème à l'attribut HTML et sauvegarder dans localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Navigation au clavier
    useEffect(() => {
    const handleKeyDown = (e) => {
      // On vérifie Ctrl + Flèche gauche/droite
      if (e.ctrlKey && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        const currentIndex = themes.findIndex((t) => t.value === theme);
        let newIndex;

        if (e.key === "ArrowRight") {
          newIndex = (currentIndex + 1) % themes.length; // suivant
        } else {
          newIndex = (currentIndex - 1 + themes.length) % themes.length; // précédent
        }

        setTheme(themes[newIndex].value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme]);

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-ghost flex items-center gap-1">
        Thème: <span className="capitalize">{theme}</span>
        <ChevronDown size={16} />
      </button>

      <ul
        tabIndex={0}
        className="z-50 dropdown-content menu p-2 shadow bg-base-100 rounded-box w-130 h-130 overflow-y-auto"
      >
        {themes.map(({ value, label, color }) => (
          <li key={value}>
            <button
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 btn btn-sm w-full justify-start ${
                theme === value ? "btn-active" : "btn-ghost"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}