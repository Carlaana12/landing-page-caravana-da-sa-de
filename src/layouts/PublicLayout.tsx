import React from 'react';
import AdSidebar from '../components/AdSidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Background from '../components/Background';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-[250px] flex-shrink-0">
          <AdSidebar />
        </div>
        <main className="flex-1 relative">
          <Background />
          <div className="relative p-6 mx-auto max-w-5xl w-full">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout; 