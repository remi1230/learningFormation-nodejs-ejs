// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';

const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { setUser }             = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      // 1️⃣ Connexion (login)
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      // 2️⃣ Ensuite on récupère l'utilisateur
      const me = await api.get('/auth/me');

      const user = me.data;

      // 3️⃣ Mettre à jour l'état global ou parent
      //if (onLoginSuccess) onLoginSuccess(user);

      // 4️⃣ Redirection selon le rôle
      if (user.role === 'Professional' || user.role === 'Administrator') {
        navigate('/backoffice');
      } else {
        navigate('/take-appointment');
      }

    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue, veuillez réessayer');
    }

    const me = await api.get('/auth/me');
    setUser(me.data);
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="mt-24 flex flex-col gap-12 items-center">
      <div className="card bg-base-200 w-80 h-80 shadow-lg flex flex-col">
        <div className="card-body flex-1 flex flex-col justify-center">
          <h2 className="card-title mb-3 text-center mx-auto">Espace Professionnel</h2>
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="prose prose-xl text-center">
        <div className=" font-bold">Démonstration</div>
        <div className="prose-lg">Une adresse email valide commançant par "professional" et n'importe quel mot de passe</div>
      </div>
    </div>
  );
}