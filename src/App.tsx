import { useState, lazy, Suspense } from 'react';
import Topbar, { PageTransition } from '@/components/Topbar';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Topbar activePage={activePage} onNavigate={setActivePage} />
      <PageTransition pageKey={activePage}>
        <Suspense fallback={<PageLoader />}>
          <PageComponent />
        </Suspense>
      </PageTransition>
      <Footer />
    </div>
  );
}
