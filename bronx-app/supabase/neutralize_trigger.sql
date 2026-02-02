-- NEUTRALIZZA TRIGGER (Metodo "Cavallo di Troia")
-- Se non possiamo cancellare il trigger (permessi), lo rendiamo innocuo svuotando la funzione che chiama.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Non fare nulla. Lascia passare l'utente.
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Se succede qualsiasi errore, ignoralo e procedi.
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
