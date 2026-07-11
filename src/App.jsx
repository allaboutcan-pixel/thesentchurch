import React, { lazy, Suspense } from 'react'; // Deployment trigger: 2026-02-25 10:11 Fix TSC/TSY translations
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

import { SiteConfigProvider } from './context/SiteConfigContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Custom lazy loading function that forces a reload if a chunk fails to load
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the error is a ChunkLoadError due to new deployment
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return a promise that never resolves temporarily to halt render until reload completes
        return new Promise(() => { });
      }
      throw error;
    }
  });

// Lazy load pages for performance
const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Resources = lazyWithRetry(() => import('./pages/Resources'));
const Ministry = lazyWithRetry(() => import('./pages/Ministry'));
const TEE = lazyWithRetry(() => import('./pages/TEE'));
const BibleStudy = lazyWithRetry(() => import('./pages/BibleStudy'));
const TeamMinistry = lazyWithRetry(() => import('./pages/TeamMinistry'));
const Prayer = lazyWithRetry(() => import('./pages/Prayer'));
const Admin = lazyWithRetry(() => import('./pages/Admin'));
const DailyWord = lazyWithRetry(() => import('./pages/DailyWord'));
const ComingSoon = lazyWithRetry(() => import('./pages/ComingSoon'));
const Mission = lazyWithRetry(() => import('./pages/Mission'));
const Login = lazyWithRetry(() => import('./pages/Login'));
const Register = lazyWithRetry(() => import('./pages/Register'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <SiteConfigProvider>
        <AuthProvider>
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />

                  {/* About Routes */}
                  <Route path="about" element={<About />} />
                  <Route path="about/*" element={<About />} />

                  {/* Ministry Routes */}
                  <Route path="ministry" element={<Ministry />} />
                  <Route path="ministry/tee" element={<TEE />} />
                  <Route path="ministry/bible" element={<BibleStudy />} />
                  <Route path="ministry/mission" element={<Mission />} /> {/* Public */}
                  <Route path="ministry/team" element={<TeamMinistry />} />
                  <Route path="ministry/prayer" element={<Prayer />} />
                  <Route path="ministry/*" element={<Ministry />} />

                  {/* News & Sermons */}
                  <Route path="news" element={<Resources />} />
                  <Route path="news/*" element={<Resources />} />

                  <Route path="sermons" element={<Resources />} />
                  <Route path="sermons/daily" element={<DailyWord />} />
                  <Route path="sermons/*" element={<Resources />} />
                </Route>
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin Route */}
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </SiteConfigProvider>
    </>
  );
}

export default App;
