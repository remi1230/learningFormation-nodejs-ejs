// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Connexion() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.redirected) {
        // navigate vers l'URL renvoyée par Express
        const url = new URL(res.url);
        navigate(url.pathname);
      } else if (res.ok) {
        // si 200 mais pas de redirect, on va par exemple vers /backoffice
        navigate('/backoffice');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue, veuillez réessayer');
    }
  };

  return (
    <div className="mt-24">
    {/* 2. Card carrée : */}
    <div
      className="
        card
        bg-base-200            /* fond gris */
        w-80                   /* largeur fixe, ex. 20rem (= 320px) */
        h-80                   /* même hauteur que la largeur */
        shadow-lg
        flex flex-col
      "
    >
      <div className="card-body flex-1 flex flex-col justify-center">
        <h2 className="card-title mb-4 text-center">Se connecter</h2>
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
    </div>
  );
}