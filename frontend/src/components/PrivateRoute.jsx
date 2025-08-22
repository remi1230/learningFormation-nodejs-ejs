// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function PrivateRoute({ children, requiredRoles = [] }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null; // ou un spinner, ou <LoadingScreen />

  if (!user) {
    return <Navigate to="/connexion-pro" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}