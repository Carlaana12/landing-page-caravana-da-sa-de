import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdBanner from './components/AdBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdSidebar from './components/AdSidebar';

// Componente de Loading para Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Pages Públicas (importadas diretamente ou também com lazy, se preferir)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const FindHere = lazy(() => import('./pages/FindHere'));
const Diseases = lazy(() => import('./pages/Diseases'));
const News = lazy(() => import('./pages/News'));
const Events = lazy(() => import('./pages/Events'));
const PublicUtilities = lazy(() => import('./pages/PublicUtilities'));
const Contact = lazy(() => import('./pages/Contact'));
const BlogList = lazy(() => import('./pages/BlogList'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const AdminLogin = lazy(() => import('./pages/Login')); // Reutilizando para Admin
const UserLogin = lazy(() => import('./pages/Login')); // Reutilizando para User
const SpecialistLogin = lazy(() => import('./pages/Login')); // Reutilizando para Specialist

// Admin Pages (Lazy Loaded)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const MediaPage = lazy(() => import('./pages/admin/Media'));
const AppearancePage = lazy(() => import('./pages/admin/Appearance'));
const SettingsPage = lazy(() => import('./pages/admin/Settings'));
const CarouselManager = lazy(() => import('./pages/admin/CarouselManager'));
const HighlightsManager = lazy(() => import('./pages/admin/HighlightsManager'));
const EventsManager = lazy(() => import('./pages/admin/EventsManager'));
const AdsManager = lazy(() => import('./pages/admin/AdsManager'));
const UsersPage = lazy(() => import('./pages/admin/users')); // Adicionado
const PostsPage = lazy(() => import('./pages/admin/posts')); // Adicionado

// User Pages (Lazy Loaded)
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));

// Specialist Pages (Lazy Loaded)
const SpecialistDashboard = lazy(() => import('./pages/specialist/Dashboard'));
const ProfileEditor = lazy(() => import('./pages/specialist/ProfileEditor'));
const ArticleEditor = lazy(() => import('./pages/specialist/ArticleEditor'));
const AvailabilityEditor = lazy(() => import('./pages/specialist/AvailabilityEditor'));

import { useAuthStore } from './lib/store';
import { USER_TYPES } from './lib/constants';

import './styles/animations.css';
// Sidebar precisa ser importado diretamente se estiver dentro do LayoutWithSidebar
import Sidebar from './components/Sidebar';

const LayoutWithSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full z-40 hidden md:block">
        <Sidebar />
      </div>
      {/* Ajuste na margem para layout responsivo */}
      <div className="flex-grow md:ml-64 bg-gray-100 p-4 md:p-6">{children}</div>
    </div>
  );
};

function App() {
  const { user, userType } = useAuthStore();

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.ADMIN) {
      return <Navigate to="/arearestrita/login" replace />;
    }
    // Suspense aqui garante fallback durante o carregamento das páginas admin
    return <LayoutWithSidebar><Suspense fallback={<LoadingFallback />}>{children}</Suspense></LayoutWithSidebar>;
  };

  const UserRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.USER) {
      return <Navigate to="/usuario/login" replace />;
    }
    return <LayoutWithSidebar><Suspense fallback={<LoadingFallback />}>{children}</Suspense></LayoutWithSidebar>;
  };

  const SpecialistRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || userType !== USER_TYPES.SPECIALIST) {
      return <Navigate to="/especialista/login" replace />;
    }
    return <LayoutWithSidebar><Suspense fallback={<LoadingFallback />}>{children}</Suspense></LayoutWithSidebar>;
  };

  return (
    <Router>
      <div className="font-sans bg-gray-100 min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <ScrollToTop />
        <AdBanner />
        <Navbar />
        <AdSidebar />
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/medico/:slug" element={<DoctorProfile />} />

              {/* Login Routes */}
              <Route path="/arearestrita/login" element={<AdminLogin />} />
              <Route path="/usuario/login" element={<UserLogin />} />
              <Route path="/especialista/login" element={<SpecialistLogin />} />

              {/* Admin Routes (Envolvidas no AdminRoute que já tem Suspense) */}
              <Route path="/arearestrita" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/arearestrita/usuarios" element={<AdminRoute><UsersPage /></AdminRoute>} />
              <Route path="/arearestrita/posts" element={<AdminRoute><PostsPage /></AdminRoute>} />
              <Route path="/arearestrita/media" element={<AdminRoute><MediaPage /></AdminRoute>} />
              <Route path="/arearestrita/destaques" element={<AdminRoute><HighlightsManager /></AdminRoute>} />
              <Route path="/arearestrita/carousel" element={<AdminRoute><CarouselManager /></AdminRoute>} />
              <Route path="/arearestrita/eventos" element={<AdminRoute><EventsManager /></AdminRoute>} />
              <Route path="/arearestrita/anuncios" element={<AdminRoute><AdsManager /></AdminRoute>} />
              <Route path="/arearestrita/aparencia" element={<AdminRoute><AppearancePage /></AdminRoute>} />
              <Route path="/arearestrita/configuracoes" element={<AdminRoute><SettingsPage /></AdminRoute>} />
              {/* Renomeei rotas antigas para nomes mais claros */}
              {/* <Route path="/arearestrita/appearance" element={<AdminRoute><AppearancePage /></AdminRoute>} /> -> /aparencia */}
              {/* <Route path="/arearestrita/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} /> -> /configuracoes */}
              {/* <Route path="/arearestrita/events" element={<AdminRoute><EventsManager /></AdminRoute>} /> -> /eventos */}
              {/* <Route path="/arearestrita/ads" element={<AdminRoute><AdsManager /></AdminRoute>} /> -> /anuncios */}

              {/* User Routes (Envolvidas no UserRoute que já tem Suspense) */}
              <Route path="/usuario/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />

              {/* Specialist Routes (Envolvidas no SpecialistRoute que já tem Suspense) */}
              <Route path="/especialista/dashboard" element={<SpecialistRoute><SpecialistDashboard /></SpecialistRoute>} />
              <Route path="/especialista/perfil-publico" element={<SpecialistRoute><ProfileEditor /></SpecialistRoute>} />
              <Route path="/especialista/disponibilidade" element={<SpecialistRoute><AvailabilityEditor /></SpecialistRoute>} />
              <Route path="/especialista/artigos/novo" element={<SpecialistRoute><ArticleEditor /></SpecialistRoute>} />
              <Route path="/especialista/artigos/:id" element={<SpecialistRoute><ArticleEditor /></SpecialistRoute>} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
