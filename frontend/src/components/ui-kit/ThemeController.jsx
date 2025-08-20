import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const themes = [
  { value: "light",        label: "Light",        color: "#ffffff" },
  { value: "bumblebee",    label: "Bumblebee",    color: "#ffffff" },
  { value: "cmyk",         label: "CMYK",         color: "#ffffff" },
  { value: "corporate",    label: "Corporate",    color: "#ffffff" },
  { value: "emerald",      label: "Emerald",      color: "#ffffff" },
  { value: "fantasy",      label: "Fantasy",      color: "#ffffff" },
  { value: "lofi",         label: "Lofi",         color: "#ffffff" },
  { value: "pastel",       label: "Pastel",       color: "#ffffff" },
  { value: "wireframe",    label: "Wireframe",    color: "#ffffff" },
  { value: "winter",       label: "Winter",       color: "#ffffff" },
  { value: "acid",         label: "Acid",         color: "#f8f8f8" },
  { value: "cupcake",      label: "Cupcake",      color: "#fbf7f4" },
  { value: "silk",         label: "Silk",         color: "#f6f5f3" },
  { value: "autumn",       label: "Autumn",       color: "#f1f1f1" },
  { value: "nord",         label: "Nord",         color: "#eceff4" },
  { value: "garden",       label: "Garden",       color: "#e9e7e8" },
  { value: "lemonade",     label: "Lemonade",     color: "#f9fdef" },
  { value: "caramellatte", label: "Caramellatte", color: "#fff6ed" },
  { value: "retro",        label: "Retro",        color: "#ede3ca" },
  { value: "valentine",    label: "Valentine",    color: "#fdf2f8" },
  { value: "cyberpunk",    label: "Cyberpunk",    color: "#fff349" },
  { value: "aqua",         label: "Aqua",         color: "#1a368a" },
  { value: "synthwave",    label: "Synthwave",    color: "#09002f" },
  { value: "abyss",        label: "Abyss",        color: "#001e29" },
  { value: "night",        label: "Night",        color: "#0f172a" },
  { value: "dim",          label: "Dim",          color: "#2a303c" },
  { value: "dracula",      label: "Dracula",      color: "#282a36" },
  { value: "dark",         label: "Dark",         color: "#1c232b" },
  { value: "business",     label: "Business",     color: "#202020" },
  { value: "halloween",    label: "Halloween",    color: "#1c1815" },
  { value: "forest",       label: "Forest",       color: "#1b1716" },
  { value: "coffee",       label: "Coffee",       color: "#261a24" },
  { value: "sunset",       label: "Sunset",       color: "#131c23" },
  { value: "luxury",       label: "Luxury",       color: "#111111" },
  { value: "black",        label: "Black",        color: "#000000" },
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
      <button tabIndex={0} className="btn btn-ghost flex lg:flex-row flex-col lg:text-sm text-xs items-center gap-1">
        <span>Thème: </span><span className="capitalize">{theme}</span>
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
                style={{ backgroundColor: color, border: "1px black solid" }}
              ></span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}