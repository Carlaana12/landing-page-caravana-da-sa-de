import React from 'react';
import { Outlet } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <AdBanner />
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
} 