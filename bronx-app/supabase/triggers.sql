-- Enable pgcrypto if not already enabled
create extension if not exists pgcrypto;

-- 1. Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'socio') -- Default to 'socio'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger on auth.users
-- Drop if exists to avoid errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
