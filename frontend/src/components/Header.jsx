// src/components/Header.jsx
import ThemeController from "./ui-kit/ThemeController.jsx";
import SchedulesSection from "./SchedulesSection.jsx";
import { Clock } from "lucide-react";

export default function Header() {
  return (
    <>
      {/* 1️⃣ Le toggle checkbox pour le modal */}
      <input type="checkbox" id="modal-horaires" className="modal-toggle" />

      {/* 2️⃣ Le modal lui-même */}
      <div className="modal">
        <div className="modal-box max-w-3xl relative">
          {/* Bouton de fermeture */}
          <label
            htmlFor="modal-horaires"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          {/* Contenu du modal : on y met ton composant */}
          <SchedulesSection />
        </div>
      </div>

      {/* 3️⃣ Le header avec le label qui déclenche l’ouverture */}
      <header className="bg-base-200 shadow-md">
        <div className="navbar px-4">
          <div className="flex-1 text-xl font-bold">Mon Site</div>
          <nav className="flex-none space-x-2">
            <a className="btn btn-ghost btn-sm" href="/">
              Accueil
            </a>
            <a className="btn btn-ghost btn-sm" href="/connexion">
              Connexion
            </a>
            {/* On passe de <a> à <label> pour déclencher le modal */}
            <label
              htmlFor="modal-horaires"
              className="btn btn-ghost btn-sm cursor-pointer"
            >
              <Clock className="h-6 w-6" />
            </label>
            <ThemeController />
          </nav>
        </div>
      </header>
    </>
  );
}