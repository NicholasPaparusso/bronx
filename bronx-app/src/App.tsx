import { useState } from 'react';
import { LoginView } from './features/auth/LoginView';
import { CatalogView } from './features/catalog/CatalogView';
import { AnimatePresence, motion } from 'framer-motion';
import { ZenithLayout } from './components/layout/ZenithLayout';
import { MainHeader } from './components/layout/MainHeader';

function App() {
  const [view, setView] = useState<'login' | 'catalog'>('login');
  const [userRole, setUserRole] = useState<'socio' | 'guest'>('socio');

  const handleLoginSuccess = () => {
    // Simulazione autorizzazione Zenith
    setTimeout(() => {
      setView('catalog');
    }, 800);
  };

  const handleLogout = () => {
    setView('login');
  };

  return (
    <ZenithLayout>
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <LoginView />

            <button
              onClick={handleLoginSuccess}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.4em] text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300"
            >
              / autorizza_accesso /
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="catalog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen flex flex-col"
          >
            <MainHeader userRole={userRole} onLogout={handleLogout} />

            <main className="flex-grow pt-28 px-6 pb-20">
              <div className="max-w-7xl mx-auto">
                <CatalogView />
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </ZenithLayout>
  );
}

export default App;
