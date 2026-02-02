-- GUEST ACCESS INFRASTRUCTURE
-- Crea la tabella per le chiavi ospiti e le policy di sicurezza.

BEGIN;

-- 1. TABELLA GUEST KEYS
CREATE TABLE IF NOT EXISTS public.guest_keys (
  id uuid default uuid_generate_v4() primary key,
  key_code text not null unique,
  is_active boolean default true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. SICUREZZA (RLS)
ALTER TABLE public.guest_keys ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono LEGGERE (per verificare se una chiave è valida al login)
CREATE POLICY "Public read keys" ON public.guest_keys FOR SELECT USING (true);

-- Policy: Solo Admin può SCRIVERE (Generare nuove chiavi)
CREATE POLICY "Admin manage keys" ON public.guest_keys FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 3. SEEDING (Chiavi di Prova)
INSERT INTO public.guest_keys (key_code, is_active, expires_at)
VALUES 
  ('BRONX-GUEST-TEST', true, now() + interval '1 year'),
  ('EVENTO-2026', true, now() + interval '7 days')
ON CONFLICT (key_code) DO NOTHING;

COMMIT;
