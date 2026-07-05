import { useState } from 'react';
import Topbar, { PageTransition } from '@/components/Topbar';
import Footer from '@/components/Footer';
import ProfilePage from '@/pages/ProfilePage';
import EducationPage from '@/pages/EducationPage';
import WorkPage from '@/pages/WorkPage';
import ConnectPage from '@/pages/ConnectPage';

type Page = 'profile' | 'education' | 'work' | 'connect';

const pages: Record<Page, React.ComponentType> = {
  profile: ProfilePage,
  education: EducationPage,
  work: WorkPage,
  connect: ConnectPage,
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>('profile');
  const PageComponent = pages[activePage];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Topbar activePage={activePage} onNavigate={setActivePage} />
      <PageTransition pageKey={activePage}>
        <PageComponent />
      </PageTransition>
      <Footer />
    </div>
  );
}
