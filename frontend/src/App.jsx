// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState }    from 'react';
import MainLayout      from './layout/MainLayout';
import Home            from './pages/Home';
import TakeAppointment from './pages/TakeAppointment';
import Login           from './pages/Login';
import BackOffice      from './pages/BackOffice';
import PrivateRoute    from './components/PrivateRoute';

export default function App() {
  const [user, setUser] = useState(null);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          1) Layout principal monté sur "/"
          2) Outlet va rendre l'enfant correspondant
        */}
        <Route path="/" element={<MainLayout />}>
          {/* index route pour Home à "/" */}
          <Route index element={<Home />} />

          {/* sous-routes : http://.../connexion et /backoffice */}
          <Route path="connexion" element={<Login onLoginSuccess={(user) => setUser(user)} />} />
          <Route path="take-appointment" element={<TakeAppointment />} />
          <Route path="backoffice" element={<BackOffice />} />

          {/* catch-all : renvoie à la home si URL inconnue */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="backoffice" element={<PrivateRoute requiredRole="Professional"><BackOffice /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}