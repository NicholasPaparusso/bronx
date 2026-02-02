-- 1. Tabella delle Prenotazioni (Carrello Temporaneo)
-- user_identifier: Può essere auth.uid() (Socio) o un Client ID generato (Guest)
CREATE TABLE IF NOT EXISTS public.cart_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_identifier TEXT NOT NULL, 
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '15 minutes')
);

-- Index per performance sulle query di scadenza e prodotto
CREATE INDEX IF NOT EXISTS idx_reservations_product ON public.cart_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON public.cart_reservations(user_identifier);
CREATE INDEX IF NOT EXISTS idx_reservations_expires ON public.cart_reservations(expires_at);

-- RLS: Permetti tutto per ora (la logica è gestita via RPC, ma serve SELECT per il client)
ALTER TABLE public.cart_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public usage of reservations" 
ON public.cart_reservations FOR ALL 
USING (true) 
WITH CHECK (true);


-- 2. View per Stock Disponibile (Stock Reale - Prenotazioni Attive)
CREATE OR REPLACE VIEW public.view_available_stock AS
SELECT 
    p.id AS product_id,
    p.stock_quantity AS base_stock,
    COALESCE(SUM(r.quantity), 0) AS reserved_quantity,
    (p.stock_quantity - COALESCE(SUM(r.quantity), 0)) AS available_quantity
FROM 
    public.products p
LEFT JOIN 
    public.cart_reservations r ON p.id = r.product_id AND r.expires_at > now()
GROUP BY 
    p.id, p.stock_quantity;


-- 3. RPC: Prenota un articolo (Atomico)
-- Ritorna TRUE se prenotato, FALSE se stock insufficiente
CREATE OR REPLACE FUNCTION public.reserve_item(
    p_product_id UUID,
    p_user_identifier TEXT,
    p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_available INTEGER;
    v_current_reserved INTEGER;
BEGIN
    -- Pulisci prima le prenotazioni scadute (lazy cleanup)
    DELETE FROM public.cart_reservations WHERE expires_at < now();

    -- Controlla stock disponibile per questo prodotto
    SELECT available_quantity INTO v_available
    FROM public.view_available_stock
    WHERE product_id = p_product_id;

    IF v_available IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- Se c'è spazio sufficiente
    IF v_available >= p_quantity THEN
        -- Controlla se l'utente ha già una prenotazione per questo prodotto
        SELECT quantity INTO v_current_reserved
        FROM public.cart_reservations
        WHERE product_id = p_product_id AND user_identifier = p_user_identifier
        LIMIT 1;

        IF v_current_reserved IS NOT NULL THEN
            -- Aggiorna esistente (resetta timer scadenza ed estende)
            UPDATE public.cart_reservations
            SET quantity = quantity + p_quantity,
                reserved_at = now(),
                expires_at = (now() + interval '15 minutes')
            WHERE product_id = p_product_id AND user_identifier = p_user_identifier;
        ELSE
            -- Inserisci nuova (usa il DEFAULT per expires_at)
            INSERT INTO public.cart_reservations (product_id, user_identifier, quantity)
            VALUES (p_product_id, p_user_identifier, p_quantity);
        END IF;

        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. RPC: Rilascia un articolo (Rimuovi dal carrello)
CREATE OR REPLACE FUNCTION public.release_item(
    p_product_id UUID,
    p_user_identifier TEXT
) RETURNS VOID AS $$
BEGIN
    DELETE FROM public.cart_reservations
    WHERE product_id = p_product_id AND user_identifier = p_user_identifier;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RPC: Conferma Ordine (Trasforma Prenotazioni in Transazione e scala Stock reale)
CREATE OR REPLACE FUNCTION public.confirm_order(
    p_user_identifier TEXT
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID := gen_random_uuid();
    r RECORD;
BEGIN
    -- Loop attraverso le prenotazioni dell'utente
    FOR r IN 
        SELECT product_id, quantity 
        FROM public.cart_reservations 
        WHERE user_identifier = p_user_identifier AND expires_at > now()
    LOOP
        -- Scala lo stock reale dalla tabella products
        UPDATE public.products
        SET stock_quantity = stock_quantity - r.quantity
        WHERE id = r.product_id;
        
        -- (Qui potresti inserire in una tabella 'orders' o 'transactions' reale)
        -- INSERT INTO public.transactions ...
    END LOOP;

    -- Svuota il carrello dell'utente
    DELETE FROM public.cart_reservations WHERE user_identifier = p_user_identifier;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
