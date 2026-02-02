-- SEED DATA - VERSION FINAL (Dynamic UUIDs)
-- Questo script CERCA l'ID vero dell'utente se esiste già, evitando errori di Foreign Key.

create extension if not exists pgcrypto;

DO $$
DECLARE
  v_socio_id uuid;
  v_admin_id uuid;
BEGIN
  -- ---------------------------------------------------
  -- 1. UTENTE SOCIO
  -- ---------------------------------------------------
  
  -- Cerca se esiste già
  SELECT id INTO v_socio_id FROM auth.users WHERE email = 'socio@bronx.eu';

  -- Se non esiste, crealo
  IF v_socio_id IS NULL THEN
    v_socio_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES
      (v_socio_id, 'authenticated', 'authenticated', 'socio@bronx.eu', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{}', current_timestamp, current_timestamp, '', '', '', '');
  END IF;

  -- Ora inserisci il profilo pubblico usando l'ID corretto (sia vecchio che nuovo)
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (v_socio_id, 'socio@bronx.eu', 'socio', 'Mario Rossi')
  ON CONFLICT (id) DO NOTHING;


  -- ---------------------------------------------------
  -- 2. UTENTE ADMIN
  -- ---------------------------------------------------

  -- Cerca se esiste già
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@bronx.eu';

  -- Se non esiste, crealo
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES
      (v_admin_id, 'authenticated', 'authenticated', 'admin@bronx.eu', crypt('password123', gen_salt('bf')), current_timestamp, current_timestamp, current_timestamp, '{"provider":"email","providers":["email"]}', '{"role":"admin"}', current_timestamp, current_timestamp, '', '', '', '');
  END IF;

  -- Profilo Admin
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (v_admin_id, 'admin@bronx.eu', 'admin', 'Boss Admin')
  ON CONFLICT (id) DO NOTHING;

END $$;
