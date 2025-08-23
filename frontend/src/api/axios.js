// src/api/axios.js
import axios from 'axios';

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? '/nodejsmysql/api'
      : '/api',
  withCredentials: true,
});