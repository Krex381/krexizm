import { useState, lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import Topbar, { PageTransition } from '@/components/Topbar';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

type Page = 'profile' | 'education' | 'work' | 'connect';

const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const EducationPage = lazy(() => import('@/pages/EducationPage'));
const WorkPage = lazy(() => import('@/pages/WorkPage'));
const ConnectPage = lazy(() => import('@/pages/ConnectPage'));

const pages: Record<Page, React.LazyExoticComponent<React.ComponentType>> = {
  profile: ProfilePage,
  education: EducationPage,
  work: WorkPage,
  connect: ConnectPage,
};

function PageLoader() {
  return (
    <div className="page-content">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="skeleton h-8 w-48 mx-auto" />
        <div className="skeleton h-32 w-full" />
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('profile');
  const PageComponent = pages[activePage];

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-accent text-background rounded font-mono text-sm">
          Skip to content
        </a>
        <Topbar activePage={activePage} onNavigate={setActivePage} />
        <PageTransition pageKey={activePage}>
          <Suspense fallback={<PageLoader />}>
            <main id="main">
              <ErrorBoundary>
                <PageComponent />
              </ErrorBoundary>
            </main>
          </Suspense>
        </PageTransition>
        <Footer />
      </div>
    </LazyMotion>
  );
}
