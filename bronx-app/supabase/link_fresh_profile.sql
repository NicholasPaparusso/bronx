-- LINK PROFILO (Da eseguire DOPO aver creato l'utente nella dashboard)

INSERT INTO public.users (id, email, role, full_name)
SELECT id, email, 'socio', 'Mario Rossi'
FROM auth.users 
WHERE email = 'socio@bronx.eu'
ON CONFLICT (id) DO NOTHING;
