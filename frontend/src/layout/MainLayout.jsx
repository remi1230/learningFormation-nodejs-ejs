import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Le contenu prend tout l'espace restant */}
      <main className="flex-grow flex flex-col p-4 items-center bg-base-100">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}