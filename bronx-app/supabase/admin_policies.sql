-- ADMIN POLICIES SETUP
-- Permette agli admin di modificare i ruoli degli utenti.

BEGIN;

-- Policy: Admin può aggiornare qualsiasi utente
-- (Necessario per Promuovere/Retrocedere utenti e bannare)
CREATE POLICY "Admins update all" ON public.users 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

COMMIT;
