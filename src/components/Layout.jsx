import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === '/';

  // Nouvelle page : on repart du haut (sauf lien vers une ancre, ex: /#services)
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      {/* L'accueil affiche sa propre barre, posée sur le hero */}
      {!isHome && <Navbar />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
