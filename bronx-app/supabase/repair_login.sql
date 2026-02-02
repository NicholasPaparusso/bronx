-- SCRIPT DI RIPARAZIONE (SAFE)
-- Non tocca i trigger, lavora sui dati esistenti.

create extension if not exists pgcrypto;

DO $$
DECLARE
  v_socio_id uuid;
  v_admin_id uuid;
BEGIN
  -- ----------------------------------------------------------------
  -- 1. SOCIO
  -- ----------------------------------------------------------------
  
  -- Cerca l'ID dell'utente Auth esistente
  SELECT id INTO v_socio_id FROM auth.users WHERE email = 'socio@bronx.eu';

  IF v_socio_id IS NOT NULL THEN
    -- A. Se esiste: Aggiorna la password per essere sicuri
    UPDATE auth.users 
    SET encrypted_password = crypt('password123', gen_salt('bf')) 
    WHERE id = v_socio_id;
    
    -- Collega il profilo pubblico
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (v_socio_id, 'socio@bronx.eu', 'socio', 'Mario Rossi')
    ON CONFLICT (id) DO UPDATE SET role = 'socio';
    
  ELSE
    -- B. Se NON esiste: Prova a crearlo (metodo standard)
    v_socio_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_socio_id, 'authenticated', 'authenticated', 'socio@bronx.eu', crypt('password123', gen_salt('bf')), now(), '{"role":"socio"}', now(), now());
    
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (v_socio_id, 'socio@bronx.eu', 'socio', 'Mario Rossi');
  END IF;


  -- ----------------------------------------------------------------
  -- 2. ADMIN
  -- ----------------------------------------------------------------
  
  -- Cerca l'ID dell'utente Auth esistente
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@bronx.eu';

  IF v_admin_id IS NOT NULL THEN
    -- A. Se esiste: Aggiorna la password
    UPDATE auth.users 
    SET encrypted_password = crypt('password123', gen_salt('bf')) 
    WHERE id = v_admin_id;
    
    -- Collega il profilo pubblico
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (v_admin_id, 'admin@bronx.eu', 'admin', 'Boss Admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
  ELSE
    -- B. Se NON esiste: Prova a crearlo
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_admin_id, 'authenticated', 'authenticated', 'admin@bronx.eu', crypt('password123', gen_salt('bf')), now(), '{"role":"admin"}', now(), now());
    
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (v_admin_id, 'admin@bronx.eu', 'admin', 'Boss Admin');
  END IF;

END $$;
