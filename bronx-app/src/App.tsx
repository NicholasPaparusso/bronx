import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ZenithLayout } from './components/layout/ZenithLayout';
import { LoginView } from './features/auth/LoginView';
import { CatalogView } from './features/catalog/CatalogView';
import { AdminView } from './features/admin/AdminView';
import { MainHeader } from './components/layout/MainHeader';
import { supabase } from './lib/supabase';

function App() {
  const [view, setView] = useState<'login' | 'catalog' | 'admin'>('login');
  const [userRole, setUserRole] = useState<'socio' | 'guest' | 'admin'>('socio');
  const [adminPage, setAdminPage] = useState<'roster' | 'inventory' | 'keys'>('roster');

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // TO DO: Fetch real role from DB. For now, infer or default.
        // If email contains 'admin', set as admin (Simple logic for Story 2.1 start)
        const role = session.user.email?.includes('admin') ? 'admin' : 'socio';
        handleLoginSuccess(role);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const role = session.user.email?.includes('admin') ? 'admin' : 'socio';
        handleLoginSuccess(role);
        setUserRole(role);
      } else {
        // Break infinite loop: Don't call handleLogout() here as it calls signOut() again
        setView('login');
        setUserRole('socio');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (role?: 'socio' | 'guest' | 'admin') => {
    const roleToCheck = role || userRole;
    if (roleToCheck === 'admin') {
      setView('admin');
    } else {
      setView('catalog');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
            <LoginView onGuestLogin={() => {
              setUserRole('guest');
              handleLoginSuccess('guest');
            }} />

            {/* DEBUG BUTTONS - KEEP FOR TESTING UNTIL FULLY VERIFIED */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setUserRole('socio'); handleLoginSuccess('socio'); }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.4em] text-neutral-500 hover:text-orange-500 hover:border-orange-500/30 transition-all duration-300"
              >
                / debug_socio /
              </button>

              <button
                onClick={() => { setUserRole('admin'); handleLoginSuccess('admin'); }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.4em] text-neutral-500 hover:text-red-500 hover:border-red-500/30 transition-all duration-300"
              >
                / debug_admin /
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="app-content" // Shared key for unified layout transition
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full min-h-screen flex flex-col"
          >
            <MainHeader
              userRole={userRole}
              onLogout={handleLogout}
              currentView={view as 'catalog' | 'admin'}
              onSwitchView={(newView) => setView(newView)}
              activeAdminPage={adminPage}
              onNavigateAdmin={(page) => setAdminPage(page)}
            />

            <main className="flex-grow pt-28 px-6 pb-20">
              {view === 'admin' ? (
                <AdminView activePage={adminPage} />
              ) : (
                <div className="max-w-7xl mx-auto">
                  <CatalogView userRole={userRole} />
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </ZenithLayout>
  );
}

export default App;
