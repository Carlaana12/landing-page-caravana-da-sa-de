import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdBanner from './components/AdBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import FindHere from './pages/FindHere';
import Diseases from './pages/Diseases';
import News from './pages/News';
import Events from './pages/Events';
import PublicUtilities from './pages/PublicUtilities';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import DoctorProfile from './pages/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Media from './pages/admin/Media';
import Appearance from './pages/admin/Appearance';
import Settings from './pages/admin/Settings';
import AdminLogin from './pages/Login';
import CarouselManager from './pages/admin/CarouselManager';
import HighlightsManager from './pages/admin/HighlightsManager';
import EventsManager from './pages/admin/EventsManager';
import AdsManager from './pages/admin/AdsManager';

// User Pages
import UserLogin from './pages/Login';
import UserDashboard from './pages/user/Dashboard';

// Specialist Pages
import SpecialistLogin from './pages/Login';
import SpecialistDashboard from './pages/specialist/Dashboard';
import ProfileEditor from './pages/specialist/ProfileEditor';
import ArticleEditor from './pages/specialist/ArticleEditor';
import AvailabilityEditor from './pages/specialist/AvailabilityEditor';

import { useAuthStore } from './lib/store';
import { USER_TYPES } from './lib/constants';

// Import styles
import './styles/animations.css';

function App() {
  const { user, userType } = useAuthStore();

  // Protected route wrapper for admin routes
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.ADMIN) {
      return <Navigate to="/arearestrita/login" replace />;
    }
    return <>{children}</>;
  };

  // Protected route wrapper for user routes
  const UserRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.USER) {
      return <Navigate to="/usuario/login" replace />;
    }
    return <>{children}</>;
  };

  // Protected route wrapper for specialist routes
  const SpecialistRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.SPECIALIST) {
      return <Navigate to="/especialista/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <ScrollToTop />
        <AdBanner />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/encontre-aqui" element={<FindHere />} />
            <Route path="/tratamentos" element={<Diseases />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/utilidades-publicas" element={<PublicUtilities />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/medico/:slug" element={<DoctorProfile />} />
            
            {/* Admin Routes */}
            <Route path="/arearestrita/login" element={<AdminLogin />} />
            <Route
              path="/arearestrita"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/media"
              element={
                <AdminRoute>
                  <Media />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/appearance"
              element={
                <AdminRoute>
                  <Appearance />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/settings"
              element={
                <AdminRoute>
                  <Settings />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/carousel"
              element={
                <AdminRoute>
                  <CarouselManager />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/destaques"
              element={
                <AdminRoute>
                  <HighlightsManager />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/events"
              element={
                <AdminRoute>
                  <EventsManager />
                </AdminRoute>
              }
            />
            <Route
              path="/arearestrita/ads"
              element={
                <AdminRoute>
                  <AdsManager />
                </AdminRoute>
              }
            />

            {/* User Routes */}
            <Route path="/usuario/login" element={<UserLogin />} />
            <Route
              path="/usuario/dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              }
            />

            {/* Specialist Routes */}
            <Route path="/especialista/login" element={<SpecialistLogin />} />
            <Route
              path="/especialista/dashboard"
              element={
                <SpecialistRoute>
                  <SpecialistDashboard />
                </SpecialistRoute>
              }
            />
            <Route
              path="/especialista/perfil-publico"
              element={
                <SpecialistRoute>
                  <ProfileEditor />
                </SpecialistRoute>
              }
            />
            <Route
              path="/especialista/disponibilidade"
              element={
                <SpecialistRoute>
                  <AvailabilityEditor />
                </SpecialistRoute>
              }
            />
            <Route
              path="/especialista/artigos/novo"
              element={
                <SpecialistRoute>
                  <ArticleEditor />
                </SpecialistRoute>
              }
            />
            <Route
              path="/especialista/artigos/:id"
              element={
                <SpecialistRoute>
                  <ArticleEditor />
                </SpecialistRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;