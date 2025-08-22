import { createContext, useContext, useEffect, useState } from "react";

const API_BASE = `${import.meta.env.BASE_URL}api`;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}