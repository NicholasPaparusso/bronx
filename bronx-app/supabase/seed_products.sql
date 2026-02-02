-- SEEDING PRODOTTI ESTESO
-- Popola il catalogo con una varietà di prodotti per testare categorie e filtri.

-- ASSICURIAMO CHE IL NOME SIA UNICO PER L'UPSERT
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_name_key') THEN 
        ALTER TABLE public.products ADD CONSTRAINT products_name_key UNIQUE (name); 
    END IF; 
END $$;

INSERT INTO public.products (name, category, price_base, price_guest, stock_quantity, description)
VALUES 
  -- BIRRE
  ('Ichnusa Non Filtrata 33cl', 'Birre', 2.50, 3.50, 48, 'Bionda sarda non filtrata.'),
  ('Tennent''s Super', 'Birre', 3.00, 4.00, 24, 'Strong Lager scozzese.'),
  ('Corona Extra', 'Birre', 3.00, 4.00, 24, 'Mexican Lager, servita con lime.'),
  ('Guinness Draught (Lattina)', 'Birre', 3.50, 5.00, 12, 'Stout irlandese cremosa.'),
  ('Punk IPA Brewdog', 'Birre', 4.00, 5.50, 24, 'IPA scozzese fruttata.'),

  -- SPIRITS (Shot/Lisci)
  ('Jack Daniel''s Shot', 'Spirits', 3.00, 4.00, 100, 'Tennessee Whiskey.'),
  ('Montenegro Shot', 'Spirits', 2.50, 3.50, 100, 'Amaro italiano.'),
  ('Jägermeister Shot', 'Spirits', 2.50, 3.50, 100, 'Amaro tedesco ghiacciato.'),
  ('Sambuca Molinari', 'Spirits', 2.50, 3.50, 100, 'Liquore all''anice.'),

  -- COCKTAILS (Kit o Premix)
  ('Gin Tonic Kit', 'Cocktails', 5.00, 7.00, 50, 'Gin Gordon''s + Tonica + Ghiaccio.'),
  ('Vodka Lemon Kit', 'Cocktails', 5.00, 7.00, 50, 'Vodka + Lemon Soda.'),
  ('Cuba Libre Kit', 'Cocktails', 5.00, 7.00, 50, 'Rum Scuro + Coca Cola.'),

  -- ANALCOLICI
  ('Coca Cola', 'Analcolici', 1.50, 2.00, 24, 'Lattina 33cl.'),
  ('Red Bull', 'Analcolici', 2.50, 3.50, 24, 'Energy Drink.'),
  ('Acqua Frizzante 50cl', 'Analcolici', 1.00, 1.50, 48, 'Bottiglietta.'),

  -- SNACKS
  ('Patatine Classiche', 'Snack', 1.00, 1.50, 20, 'Sacchetto standard.'),
  ('Taralli Pugliesi', 'Snack', 1.50, 2.00, 15, 'Pacchetto monoporzione.'),
  ('Schiacciatine Rosmarino', 'Snack', 1.00, 1.50, 15, 'Snack salato.')

ON CONFLICT (name) DO UPDATE 
SET 
  price_base = EXCLUDED.price_base,
  price_guest = EXCLUDED.price_guest,
  stock_quantity = EXCLUDED.stock_quantity;
