// src/components/Header.jsx
import ThemeController from "./ui-kit/ThemeController.jsx";
import SchedulesSection from "./SchedulesSection.jsx";
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Clock } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const { user, loading } = useAuth();

   const titles = {
    '/': 'Accueil',
    '/connexion': 'Connexion',
    '/backoffice': 'Back Office',
    '/take-appointment': 'Rendez-vous',
  };

  const title = titles[location.pathname] || 'Page';

  return (
    <>
      <input type="checkbox" id="modal-horaires" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box max-w-3xl relative">
          {/* Bouton de fermeture */}
          <label
            htmlFor="modal-horaires"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          {/* Contenu */}
          <SchedulesSection />
        </div>

        {/* Clic extérieur → ferme le modal */}
        <label className="modal-backdrop" htmlFor="modal-horaires"></label>
      </div>


      {/* 3️⃣ Le header avec le label qui déclenche l’ouverture */}
      <header className="bg-base-200/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="navbar px-4">
          <div className=" flex items-baseline flex-1">
            <div><a className="flex-1 text-xl font-bold btn btn-ghost btn-sm p-1 mr-1" href="/">Clinique dentaire - {title}</a></div>
            {loading ? (
              <span className="text-sm text-gray-400">Chargement...</span>
            ) : user ? (
              <div className="flex flex-row gap-2">
                <span className="badge badge-xs badge-accent">{user.firstName + ' ' + user.lastName}</span>
                <span className="badge badge-xs badge-primary">{user.role}</span>
              </div>
            ) : (
              <span className="badge badge-xs badge-info">Non connecté</span>
            )}
          </div>
          <nav className="flex-none space-x-2">
            <a className="btn btn-ghost btn-sm" href="/">Accueil</a>
            <a className="btn btn-ghost btn-sm" href="/connexion">Connexion</a>
            <label htmlFor="modal-horaires" className="btn btn-ghost btn-sm cursor-pointer">
              <Clock className="h-6 w-6" />
            </label>
            <ThemeController />
          </nav>
        </div>
      </header>
    </>
  );
}