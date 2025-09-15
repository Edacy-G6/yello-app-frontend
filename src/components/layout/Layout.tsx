import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Détermine si on doit afficher le sidebar (pages avec rôles spécifiques)
  const shouldShowSidebar = user && (
    (user.role === 'teacher' && location.pathname.startsWith('/teacher')) ||
    (user.role === 'student' && location.pathname.startsWith('/student')) ||
    (user.role === 'parent' && location.pathname.startsWith('/parent')) ||
    (user.role === 'admin' && location.pathname.startsWith('/admin'))
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (shouldShowSidebar) {
    // Layout avec sidebar pour les pages authentifiées avec rôles spécifiques
    return (
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
          <Sidebar className="h-full" variant={user?.role as 'teacher' | 'student' | 'parent' | 'admin'} />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex flex-col">
          {/* Header dynamique avec sidebar */}
          <Header 
            showSidebar={true} 
            onToggleSidebar={toggleSidebar}
          />

          {/* Zone de contenu */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>

          {/* Footer dynamique avec sidebar */}
          <Footer showSidebar={true} />
        </div>
      </div>
    );
  }

  // Layout standard pour les pages sans sidebar (accueil, login, register, etc.)
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header dynamique sans sidebar */}
      <Header showSidebar={false} />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer dynamique sans sidebar */}
      <Footer showSidebar={false} />
    </div>
  );
}

// Export du Sidebar
export { default as Sidebar } from './Sidebar';
