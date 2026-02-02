-- SBLOCCO CANCELLAZIONE
-- Non riesci a cancellare l'utente dalla Dashboard perché esiste un "collegamento" nella tabella profili.
-- Questo script rompe il collegamento cancellando prima il profilo.

-- 1. Cancella il profilo pubblico (il "figlio")
DELETE FROM public.users WHERE email = 'socio@bronx.eu';

-- 2. Ora opzionalmente proviamo a cancellare anche l'Auth (il "padre") direttamente da qui
DELETE FROM auth.users WHERE email = 'socio@bronx.eu';
