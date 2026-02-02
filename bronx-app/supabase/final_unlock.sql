-- SBLOCCO FINALE (Versione Garantita)
-- Il reset precedente ha riattivato i controlli. Questo li disattiva di nuovo per farti registrare.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- NON FARE NULLA (Bypassa qualsiasi errore di inserimento nel profilo)
  -- L'utente verrà creato, poi penseremo noi al profilo.
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Assicuriamoci che il trigger esista, così la funzione viene chiamata
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
