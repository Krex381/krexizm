import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { LazyMotion, m, AnimatePresence, domAnimation } from 'framer-motion';

type Page = 'profile' | 'education' | 'work' | 'connect';

const tabs: { id: Page; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'education', label: 'Education' },
  { id: 'work', label: 'Work' },
  { id: 'connect', label: 'Connect' },
];

export default function Topbar({ activePage, onNavigate }: { activePage: Page; onNavigate: (p: Page) => void }) {
  const tabRefs = useRef<Map<Page, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current.get(activePage);
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activePage]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="topbar">
        <div className="topbar-border" />
        <m.div
          className="topbar-indicator"
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
            className={`topbar-tab ${activePage === tab.id ? 'active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            type="button"
            aria-current={activePage === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </LazyMotion>
  );
}

export function PageTransition({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait">
        <m.div
          key={pageKey}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
