-- SCRIPT PULIZIA TOTALE (SBLOCCA TUTTO)
-- Esegui questo per rimuovere qualsiasi automatismo che sta bloccando la creazione utenti.

-- 1. Rimuovi il Trigger (se esiste)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Rimuovi la Funzione (se esiste)
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. (Opzionale) Pulisce utenti orfani creati a metà
-- DELETE FROM auth.users WHERE email IN ('socio@bronx.eu', 'admin@bronx.eu');
