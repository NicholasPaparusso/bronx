-- Enable RLS
alter table auth.users enable row level security;

-- USERS TABLE (Public Profile)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  role text default 'socio' check (role in ('admin', 'socio', 'guest')),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.users
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update profiles" on public.users
  for update using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null, -- 'beer', 'snack', 'cocktail'
  price_base numeric not null, -- Prezzo Socio
  price_guest numeric not null, -- Prezzo Guest (+30% logic applied in UI or computed column)
  stock_quantity integer default 0,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Anyone can view active products" on public.products
  for select using (is_active = true);

create policy "Admins can manage products" on public.products
  for all using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- TRANSACTIONS TABLE
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users, -- Nullable for anonymous guests if needed, strictly linked for registered
  guest_session_id text, -- For tracking guest purchases if not auth.users linked
  total_amount numeric not null,
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  payment_provider text default 'paypal',
  payment_id text, -- PayPal Transaction ID
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions" on public.transactions
  for select using (auth.uid() = user_id);

create policy "Admins can view all transactions" on public.transactions
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- TRANSACTION ITEMS (Details)
create table public.transaction_items (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions not null,
  product_id uuid references public.products not null,
  quantity integer not null,
  price_at_purchase numeric not null
);

alter table public.transaction_items enable row level security;

create policy "Users can view own transaction items" on public.transaction_items
  for select using (
    exists (
      select 1 from public.transactions
      where public.transactions.id = transaction_items.transaction_id
      and public.transactions.user_id = auth.uid()
    )
  );

create policy "Admins can view all transaction items" on public.transaction_items
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );
