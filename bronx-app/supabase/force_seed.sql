-- FORCE INSERT SCRIPT (Bypass Triggers)
-- Questo script DISABILITA i controlli, inserisce gli utenti e RIABILITA i controlli.

BEGIN;

-- 1. Disabilita temporaneamente i trigger su auth.users
ALTER TABLE auth.users DISABLE TRIGGER ALL;

-- 2. Crea estensione crypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3. Inserisci Utenti AUTH (Se non esistono)
INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'authenticated', 'authenticated', 'socio@bronx.eu', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', '')
ON CONFLICT (email) DO NOTHING;

INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'authenticated', 'authenticated', 'admin@bronx.eu', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{"role":"admin"}', current_timestamp, current_timestamp, '', '', '', '')
ON CONFLICT (email) DO NOTHING;

-- 4. Riabilita i trigger
ALTER TABLE auth.users ENABLE TRIGGER ALL;

-- 5. Inserisci Profili PUBLICI
INSERT INTO public.users (id, email, role, full_name)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'socio@bronx.eu', 'socio', 'Mario Rossi')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, role, full_name)
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'admin@bronx.eu', 'admin', 'Boss Admin')
ON CONFLICT (id) DO NOTHING;

COMMIT;
