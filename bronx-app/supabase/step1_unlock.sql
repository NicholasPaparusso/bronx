-- PASSO 1: DISARMA TUTTO
-- Rimuove i blocchi che impedivano la creazione manuale dell'utente.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Pulisce eventuali utenti "rotti" per ripartire da zero
DELETE FROM auth.users WHERE email IN ('socio@bronx.eu', 'admin@bronx.eu');
