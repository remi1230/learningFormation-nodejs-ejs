// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;

  if (!user) return <Navigate to="/connexion" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;

  return children;
}