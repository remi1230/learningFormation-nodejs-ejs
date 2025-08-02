// src/layout/MainLayout.jsx
import Header from "../components/Header.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col p-4 items-center bg-base-100 ">
        {children}
      </main>
    </div>
  );
}