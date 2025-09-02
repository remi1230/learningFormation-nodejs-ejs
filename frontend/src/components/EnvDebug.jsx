// src/components/EnvDebug.jsx
export default function EnvDebug() {
  console.log('import.meta.env =', import.meta.env);

  return (
    <div style={{ padding: '1rem', background: '#eee', fontSize: '14px' }}>
      <h3>Vite Env Debug</h3>
      <ul>
        <li><b>MODE</b>: {import.meta.env.MODE}</li>
        <li><b>DEV</b>: {String(import.meta.env.DEV)}</li>
        <li><b>PROD</b>: {String(import.meta.env.PROD)}</li>
        <li><b>BASE_URL</b>: {import.meta.env.BASE_URL}</li>
      </ul>
    </div>
  );
}