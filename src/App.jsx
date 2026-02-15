import React, { lazy, Suspense } from 'react'; // Deployment trigger: 2026-02-14 20:45 Fix unused var
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

import { SiteConfigProvider } from './context/SiteConfigContext';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Resources = lazy(() => import('./pages/Resources'));
const Ministry = lazy(() => import('./pages/Ministry'));
const TEE = lazy(() => import('./pages/TEE'));
const TeamMinistry = lazy(() => import('./pages/TeamMinistry'));
const Prayer = lazy(() => import('./pages/Prayer'));
const Admin = lazy(() => import('./pages/Admin'));
const DailyWord = lazy(() => import('./pages/DailyWord'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));

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
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* About Routes */}
                <Route path="about" element={<About />} />
                <Route path="about/*" element={<About />} />

                <Route path="ministry" element={<Ministry />} />
                <Route path="ministry/tee" element={<TEE />} />
                <Route path="ministry/mission" element={<ComingSoon type="mission" />} />
                <Route path="ministry/team" element={<TeamMinistry />} />
                <Route path="ministry/prayer" element={<Prayer />} />
                <Route path="ministry/*" element={<Ministry />} />

                <Route path="news" element={<Resources />} />
                <Route path="news/*" element={<Resources />} />

                <Route path="sermons" element={<Resources />} />
                <Route path="sermons/daily" element={<DailyWord />} />
                <Route path="sermons/*" element={<Resources />} />
              </Route>
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </SiteConfigProvider>
    </>
  );
}

export default App;
