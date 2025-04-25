import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import AdSidebar from '../components/AdSidebar';
import '../config/react';

const MainLayout: React.FC = () => {
  const headerHeight = 110;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.document) {
      const problematicScripts = document.querySelectorAll('script');
      problematicScripts.forEach(script => {
        if (script.src.includes('react-devtools') || 
            script.src.includes('unsupported-source')) {
          script.remove();
        }
      });
      document.cookie = 'SameSite=Lax; Secure; path=/';
    }
  }, []);

  const mainMarginClass = 'md:ml-[240px]';

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <AdSidebar />
      <main className={`flex-grow pt-[${headerHeight}px] bg-gray-100 ${mainMarginClass} transition-all duration-300 ease-in-out`}>
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default MainLayout;
