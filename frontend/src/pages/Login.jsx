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

      if (!res.ok) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      // ↙️ On récupère la réponse brute
      const data = await res.json();
      console.log('Login response payload →', data);

      // ↙️ On prend soit data.user, soit data directement
      const user = data.user || data;

      if (!user || !user.role) {
        setError("Impossible de récupérer votre rôle. Contactez l'administrateur.");
        return;
      }

      if (user.role === 'Professional') {
        navigate('/backoffice');
      } else {
        navigate('/take-appointment');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue, veuillez réessayer');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="mt-24 flex justify-center">
      <div className="card bg-base-200 w-80 h-80 shadow-lg flex flex-col">
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
        <div className="text-center mt-10">
          <button
            className="btn btn-outline btn-primary"
            onClick={handleGoogleLogin}
          >
            Se connecter avec Google
          </button>
      </div>
      </div>
    </div>
  );
}