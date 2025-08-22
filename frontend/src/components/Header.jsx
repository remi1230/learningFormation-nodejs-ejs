// src/components/Header.jsx
import { Link } from 'react-router-dom'
import ThemeController from "./ui-kit/ThemeController.jsx";
import SchedulesSection from "./SchedulesSection.jsx";
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock } from "lucide-react";
import { LogOut } from "lucide-react";


const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function Header() {
  const location = useLocation();
  const { user, setUser, loading } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Logout failed (${res.status})`);
      }
      setUser(null);
      // selon ton routing, choisis l’une des options :
      window.location.assign("/");   // recharge et revient à l’accueil
      navigate("/");                 // si tu utilises react-router
    } catch (e) {
      console.error(e);
    } finally {
      setLoggingOut(false);
    }
  };

   const titles = {
    '/': 'Accueil',
    '/connexion': 'Connexion',
    '/backoffice': 'Back Office',
    '/take-appointment': 'Rendez-vous',
  };

  const title = titles[location.pathname] || 'Page';

  const userRoles = {
    'Administrator': 'Administrateur',
    'Patient'      : 'Patient',
    'Professional' : 'Professionnel',
  };

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
        <div className="navbar px-4 relative"> {/* relative pour l'absolu du centre */}
          {/* START */}
          <div className="navbar-start flex items-center gap-2">
            <Link className="text-md lg:text-lg xl:text-xl font-bold btn btn-ghost btn-sm p-1 mr-1 whitespace-nowrap" to={import.meta.env.BASE_URL}>
              <div className="flex flex-col xl:flex-row gap-1">
                <div>Clinique dentaire</div><div className="hidden xl:block">-</div><div>{title}</div> 
              </div>
            </Link>
            
            {loading ? (
              <span className="text-sm text-gray-400">Chargement...</span>
            ) : user ? (
              <div className="flex flex-col 2xl:flex-row gap-2">
                <span className="badge badge-xs badge-accent flex-none whitespace-nowrap">
                  {user.firstName + " " + user.lastName}
                </span>
                <span className="badge badge-xs badge-primary flex-none whitespace-nowrap">{userRoles[user.role]}</span>
              </div>
            ) : (
              <span className="badge badge-xs badge-info flex-none whitespace-nowrap">Non connecté</span>
            )}
          </div>

          {/* CENTER — centré optiquement, quelle que soit la largeur start/end */}
          <div className="navbar-center absolute left-1/2 -translate-x-1/2
                          lg:static lg:translate-x-0">
            <Link className="text-sm lg:text-xl btn btn-ghost btn-lg" to="/">Accueil</Link>

            {user ? (
              user.role === "Professional" || user.role === "Administrator" ? null : (
                <Link className="text-sm lg:text-xl btn btn-ghost btn-lg" to="/take-appointment">RDV</Link>
              )
            ) : (
              <Link className="text-sm lg:text-xl btn btn-ghost btn-lg" to="/connexion">Espace client</Link>
            )}

            {user && (user.role === "Professional" || user.role === "Administrator") ? (
              <Link className="text-base lg:text-xl btn btn-ghost btn-lg" to="/backoffice">Administration</Link>
            ) : !user ? (
              <Link className="text-base lg:text-xl btn btn-ghost btn-lg" to="/connexion-pro">Accès Professionnel</Link>
            ) : null}
          </div>

          {/* END */}
          <div className="navbar-end flex items-center space-x-2">
            <ThemeController />

            <label htmlFor="modal-horaires" className="btn btn-ghost btn-sm cursor-pointer">
              <Clock className="h-6 w-6" />
            </label>

            {user ? (
              <div className="tooltip tooltip-left tooltip-accent" data-tip="Se déconnecter">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  title="Se déconnecter"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
              
            ) : null}
          </div>
        </div>
      </header>

    </>
  );
}