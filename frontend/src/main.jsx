import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

const API_BASE = `${import.meta.env.BASE_URL}api`;
// Écrase tout baseURL absolu résiduel
delete axios.defaults.baseURL;
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

console.log('[axios baseURL]', axios.defaults.baseURL);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="VOTRE_CLIENT_ID">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);