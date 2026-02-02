-- MASTER RESET (TABULA RASA)
-- Questo script cancella TUTTO e ricrea solo le tabelle pulite.
-- NIENTE TRIGGER, NIENTE AUTOMATISMI COMPLESSI.

BEGIN;

-- 1. PULIZIA TOTALE (DROP)
-- Rimuovi trigger su auth (se esistono)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Rimuovi tabelle pubbliche
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. CREAZIONE TABELLE PULITE
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabella Profili
CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'socio' check (role in ('admin', 'socio', 'guest')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policy Sicurezza Users (Semplice)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Tabella Prodotti
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

-- Policy Sicurezza Prodotti (Semplice)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view products" ON public.products FOR SELECT USING (is_active = true);


COMMIT;
