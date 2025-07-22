-- Enable RLS (Row Level Security)
alter table if exists public.totp_secrets enable row level security;

-- Create totp_secrets table
create table if not exists public.totp_secrets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  label text not null,
  secret text not null,
  issuer text,
  algorithm text default 'SHA1',
  digits integer default 6,
  period integer default 30,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create RLS policies
create policy "Users can view their own secrets" on public.totp_secrets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own secrets" on public.totp_secrets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own secrets" on public.totp_secrets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own secrets" on public.totp_secrets
  for delete using (auth.uid() = user_id);

-- Create shared_secrets table for public sharing
create table if not exists public.shared_secrets (
  id uuid default gen_random_uuid() primary key,
  secret_id uuid references public.totp_secrets(id) on delete cascade not null,
  share_token text unique not null,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- RLS for shared_secrets
alter table public.shared_secrets enable row level security;

create policy "Anyone can view shared secrets with valid token" on public.shared_secrets
  for select using (true);

create policy "Users can create shares for their secrets" on public.shared_secrets
  for insert with check (
    exists (
      select 1 from public.totp_secrets 
      where id = secret_id and user_id = auth.uid()
    )
  );

create policy "Users can delete their own shares" on public.shared_secrets
  for delete using (
    exists (
      select 1 from public.totp_secrets 
      where id = secret_id and user_id = auth.uid()
    )
  );

-- Create indexes
create index if not exists totp_secrets_user_id_idx on public.totp_secrets(user_id);
create index if not exists shared_secrets_token_idx on public.shared_secrets(share_token);
create index if not exists shared_secrets_secret_id_idx on public.shared_secrets(secret_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists handle_updated_at on public.totp_secrets;
create trigger handle_updated_at
  before update on public.totp_secrets
  for each row
  execute function public.handle_updated_at(); 