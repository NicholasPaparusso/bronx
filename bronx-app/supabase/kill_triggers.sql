-- PULIZIA DEFINITIVA
-- Rimuove TUTTI i trigger su auth.users per sbloccare la dashboard

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Se ce ne sono altri con nomi diversi, li togliamo (nomi standard)
DROP TRIGGER IF EXISTS on_auth_user_created_trigger ON auth.users;
