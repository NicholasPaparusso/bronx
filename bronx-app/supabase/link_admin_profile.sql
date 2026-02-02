-- LINK ADMIN (Da eseguire DOPO aver creato admin@bronx.eu)

INSERT INTO public.users (id, email, role, full_name)
SELECT id, email, 'admin', 'Boss Admin'
FROM auth.users 
WHERE email = 'admin@bronx.eu'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
