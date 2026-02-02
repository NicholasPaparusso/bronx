-- BRONX DB RESET & INIT (FULL PACKAGE)
-- Esegui questo script per resettare completamente il database e ripartire pulito.

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. PULIZIA (DROP EVERYTHING)
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;


-- -----------------------------------------------------------------------------
-- 2. CREAZIONE SCHEMA (TABLES)
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabella Users (Profili Pubblici)
CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'socio' check (role in ('admin', 'socio', 'guest')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabella Products (Catalogo)
CREATE TABLE public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null,
  price_base numeric not null,
  price_guest numeric not null,
  stock_quantity integer default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- -----------------------------------------------------------------------------
-- 3. AUTOMAZIONE (TRIGGERS)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'socio')
  )
  ON CONFLICT (id) DO NOTHING; -- Evita errori se esiste già
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- -----------------------------------------------------------------------------
-- 4. SICUREZZA (POLICIES)
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- -----------------------------------------------------------------------------
-- 5. SEEDING (POPOLAMENTO DATI)
-- -----------------------------------------------------------------------------

-- Iniezione Utenti tramite blocco PL/pgSQL per gestire conflitti ID
DO $$
DECLARE
  v_socio_id uuid;
  v_admin_id uuid;
BEGIN
  -- A. GESTIONE SOCIO
  SELECT id INTO v_socio_id FROM auth.users WHERE email = 'socio@bronx.eu';
  
  IF v_socio_id IS NULL THEN
    -- Crea Nuovo (Il Trigger creerà il profilo pubblico)
    v_socio_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_socio_id, 'authenticated', 'authenticated', 'socio@bronx.eu', crypt('password123', gen_salt('bf')), now(), '{"role":"socio", "full_name":"Mario Rossi"}', now(), now());
  ELSE
    -- Esiste già: Aggiorna Pwd e Forza profilo pubblico (perché il trigger non scatta su update)
    UPDATE auth.users SET encrypted_password = crypt('password123', gen_salt('bf')) WHERE id = v_socio_id;
    INSERT INTO public.users (id, email, role, full_name) VALUES (v_socio_id, 'socio@bronx.eu', 'socio', 'Mario Rossi') ON CONFLICT (id) DO NOTHING;
  END IF;

  -- B. GESTIONE ADMIN
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@bronx.eu';
  
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES (v_admin_id, 'authenticated', 'authenticated', 'admin@bronx.eu', crypt('password123', gen_salt('bf')), now(), '{"role":"admin", "full_name":"Boss Admin"}', now(), now());
  ELSE
    UPDATE auth.users SET encrypted_password = crypt('password123', gen_salt('bf')) WHERE id = v_admin_id;
    INSERT INTO public.users (id, email, role, full_name) VALUES (v_admin_id, 'admin@bronx.eu', 'admin', 'Boss Admin') ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Prodotti Demo
INSERT INTO public.products (name, category, price_base, price_guest, stock_quantity, description)
VALUES 
  ('Heineken 33cl', 'Birre', 3.50, 5.00, 100, 'Lager bionda, classica.'),
  ('Gin Tonic', 'Cocktail', 6.00, 8.00, 50, 'Gin Gordon + Tonica.'),
  ('Acqua Naturale 50cl', 'Analcolici', 1.00, 1.50, 200, 'H2O base.')
ON CONFLICT DO NOTHING;

COMMIT;
