-- EMERGENCY DISABLE (SBLOCCA REGISTRAZIONE)
-- Esegui questo per togliere qualsiasi automatismo che fallisce.

BEGIN;

-- 1. Rimuovi Trigger e Funzioni (i colpevoli dell'errore)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Rimuovi eventuali policy restrittive che potrebbero bloccare
DROP POLICY IF EXISTS "Users view own" ON public.users;
DROP POLICY IF EXISTS "Admins view all" ON public.users;

-- 3. Policy "Permissiva" temporanea (per evitare errori RLS se dovesse servire)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Emergency Access" ON public.users FOR ALL USING (true) WITH CHECK (true);

COMMIT;
