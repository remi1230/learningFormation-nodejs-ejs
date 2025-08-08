import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const themes = [
  { value: "light",        label: "Light" },
  { value: "dark",         label: "Dark" },
  { value: "cupcake",      label: "Cupcake" },
  { value: "bumblebee",    label: "Bumblebee" },
  { value: "emerald",      label: "Emerald" },
  { value: "corporate",    label: "Corporate" },
  { value: "synthwave",    label: "Synthwave" },
  { value: "retro",        label: "Retro" },
  { value: "cyberpunk",    label: "Cyberpunk" },
  { value: "valentine",    label: "Valentine" },
  { value: "halloween",    label: "Halloween" },
  { value: "garden",       label: "Garden" },
  { value: "forest",       label: "Forest" },
  { value: "aqua",         label: "Aqua" },
  { value: "lofi",         label: "Lofi" },
  { value: "pastel",       label: "Pastel" },
  { value: "fantasy",      label: "Fantasy" },
  { value: "wireframe",    label: "Wireframe" },
  { value: "black",        label: "Black" },
  { value: "luxury",       label: "Luxury" },
  { value: "dracula",      label: "Dracula" },
  { value: "cmyk",         label: "CMYK" },
  { value: "autumn",       label: "Autumn" },
  { value: "business",     label: "Business" },
  { value: "acid",         label: "Acid" },
  { value: "lemonade",     label: "Lemonade" },
  { value: "night",        label: "Night" },
  { value: "coffee",       label: "Coffee" },
  { value: "winter",       label: "Winter" },
  { value: "dim",          label: "Dim" },
  { value: "nord",         label: "Nord" },
  { value: "sunset",       label: "Sunset" },
  { value: "caramellatte", label: "Caramellatte" },
  { value: "abyss",        label: "Abyss" },
  { value: "silk",         label: "Silk" },
  { value: "default",      label: "Default" },
];

export default function ThemeController() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "default"
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
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
      >
        {themes.map(({ value, label }) => (
          <li key={value}>
            <button
              onClick={() => setTheme(value)}
              className={`btn btn-sm w-full justify-start ${
                theme === value ? "btn-active" : "btn-ghost"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}