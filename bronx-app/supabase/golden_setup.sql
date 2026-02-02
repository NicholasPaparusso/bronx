-- GOLDEN SETUP V1.0 - BRONX PROTOCOL
-- Esegui questo script SU UN PROGETTO SUPABASE NUOVO/VUOTO.
-- Questo crea Tabelle, Policy e Referenze. NON crea Trigger complessi.

BEGIN;

-- 1. UTILITY
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELLA USERS (Profili Pubblici)
CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'socio' check (role in ('admin', 'socio', 'guest')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policy Sicurezza: Ognuno vede se stesso, Admin vede tutti
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 3. TABELLA PRODUCTS (Catalogo)
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

-- Policy Sicurezza: Tutti vedono prodotti attivi, Solo Admin modifica
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view products" ON public.products FOR SELECT USING (is_active = true);


-- 4. POPOLE I PRODOTTI DEMO
INSERT INTO public.products (name, category, price_base, price_guest, stock_quantity, description)
VALUES 
  ('Heineken 33cl', 'Birre', 3.50, 5.00, 100, 'Lager bionda, classica.'),
  ('Gin Tonic', 'Cocktail', 6.00, 8.00, 50, 'Gin Gordon + Tonica.'),
  ('Acqua Naturale 50cl', 'Analcolici', 1.00, 1.50, 200, 'H2O base.')
ON CONFLICT DO NOTHING;

COMMIT;

-- FINE SETUP.
-- ORA CREA GLI UTENTI MANUALMENTE DALLA DASHBOARD.
