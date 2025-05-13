import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdBanner from './components/AdBanner';
import AdSidebar from './components/AdSidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Background from './components/Background';

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
import { USER_TYPES, AUTH_URLS } from './lib/constants';

// Import styles
import './styles/animations.css';

import PatientDashboard from './pages/patient/Dashboard';
import PatientLayout from './components/patient/PatientLayout';
import ScheduleAppointment from './pages/patient/ScheduleAppointment';
import Exams from './pages/patient/Exams';
import MedicalHistory from './pages/patient/MedicalHistory';
import Profile from './pages/patient/Profile';

function App() {
  // Remover a leitura do estado aqui, pois será feita dentro dos guards
  // const { user, userType } = useAuthStore(); 

  // Protected route wrapper for admin routes
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, userType } = useAuthStore(); // Ler o estado DENTRO do guard
    const location = useLocation(); // Para passar o local de origem
    if (!user || userType !== USER_TYPES.ADMIN) {
      // Adiciona log para depuração
      console.log(`AdminRoute: Redirecting. User: ${!!user}, UserType: ${userType}`);
      return <Navigate to="/arearestrita/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  // Protected route wrapper for user/patient routes
  const UserRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, userType } = useAuthStore(); // Ler o estado DENTRO do guard
    const location = useLocation(); // Para passar o local de origem
    if (!user || userType !== USER_TYPES.PATIENT) { 
      // Adiciona log para depuração
      console.log(`UserRoute: Redirecting. User: ${!!user}, UserType: ${userType}`);
      return <Navigate to={AUTH_URLS.USER_LOGIN} state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  // Protected route wrapper for specialist routes
  const SpecialistRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, userType } = useAuthStore(); // Ler o estado DENTRO do guard
    const location = useLocation(); // Para passar o local de origem
    if (!user || userType !== USER_TYPES.SPECIALIST) {
      // Adiciona log para depuração
      console.log(`SpecialistRoute: Redirecting. User: ${!!user}, UserType: ${userType}`);
      return <Navigate to="/especialista/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="font-sans min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <ScrollToTop />
        <AdBanner />
        <Navbar />
        <main className="flex-grow relative">
          <Background />
          <div className="relative">
            <AdSidebar />
            <div className="ml-[250px]">
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
                <Route path="/arearestrita" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/arearestrita/media" element={<AdminRoute><Media /></AdminRoute>} />
                <Route path="/arearestrita/aparencia" element={<AdminRoute><Appearance /></AdminRoute>} />
                <Route path="/arearestrita/configuracoes" element={<AdminRoute><Settings /></AdminRoute>} />
                <Route path="/arearestrita/carrossel" element={<AdminRoute><CarouselManager /></AdminRoute>} />
                <Route path="/arearestrita/destaques" element={<AdminRoute><HighlightsManager /></AdminRoute>} />
                <Route path="/arearestrita/eventos" element={<AdminRoute><EventsManager /></AdminRoute>} />
                <Route path="/arearestrita/anuncios" element={<AdminRoute><AdsManager /></AdminRoute>} />

                {/* User Routes */}
                <Route path="/usuario/login" element={<UserLogin />} />
                <Route path="/usuario/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />

                {/* Specialist Routes */}
                <Route path="/especialista/login" element={<SpecialistLogin />} />
                <Route path="/especialista/dashboard" element={<SpecialistRoute><SpecialistDashboard /></SpecialistRoute>} />
                <Route path="/especialista/perfil" element={<SpecialistRoute><ProfileEditor /></SpecialistRoute>} />
                <Route path="/especialista/artigos" element={<SpecialistRoute><ArticleEditor /></SpecialistRoute>} />
                <Route path="/especialista/disponibilidade" element={<SpecialistRoute><AvailabilityEditor /></SpecialistRoute>} />

                {/* Patient Routes */}
                <Route path="/paciente/login" element={<UserLogin />} />
                <Route path="/paciente/dashboard" element={<UserRoute><PatientDashboard /></UserRoute>} />
                <Route path="/paciente/agendar" element={<UserRoute><ScheduleAppointment /></UserRoute>} />
                <Route path="/paciente/exames" element={<UserRoute><Exams /></UserRoute>} />
                <Route path="/paciente/historico" element={<UserRoute><MedicalHistory /></UserRoute>} />
                <Route path="/paciente/perfil" element={<UserRoute><Profile /></UserRoute>} />

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;