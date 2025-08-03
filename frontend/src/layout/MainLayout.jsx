import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col p-4 items-center bg-base-100">
        <Outlet />
      </main>
    </div>
  );
}