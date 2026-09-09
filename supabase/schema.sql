-- Ana Beauty Studio — esquema inicial
-- Ejecutar en Supabase: SQL Editor → New query → Run
-- Después crea el usuario admin en Authentication → Users.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default 'General',
  alt_text text not null default '',
  storage_path text not null unique,
  public_url text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists portfolio_images_set_updated_at on public.portfolio_images;
create trigger portfolio_images_set_updated_at
before update on public.portfolio_images
for each row execute function public.set_updated_at();

drop trigger if exists service_packages_set_updated_at on public.service_packages;
create trigger service_packages_set_updated_at
before update on public.service_packages
for each row execute function public.set_updated_at();

create index if not exists portfolio_images_order_idx
  on public.portfolio_images (display_order asc, created_at desc);

create index if not exists service_packages_order_idx
  on public.service_packages (display_order asc, created_at desc);

create index if not exists service_packages_available_idx
  on public.service_packages (is_available);

alter table public.portfolio_images enable row level security;
alter table public.service_packages enable row level security;

drop policy if exists "Public can view portfolio" on public.portfolio_images;
create policy "Public can view portfolio"
  on public.portfolio_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert portfolio" on public.portfolio_images;
create policy "Authenticated can insert portfolio"
  on public.portfolio_images
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update portfolio" on public.portfolio_images;
create policy "Authenticated can update portfolio"
  on public.portfolio_images
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete portfolio" on public.portfolio_images;
create policy "Authenticated can delete portfolio"
  on public.portfolio_images
  for delete
  to authenticated
  using (true);

drop policy if exists "Public can view packages" on public.service_packages;
create policy "Public can view packages"
  on public.service_packages
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert packages" on public.service_packages;
create policy "Authenticated can insert packages"
  on public.service_packages
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update packages" on public.service_packages;
create policy "Authenticated can update packages"
  on public.service_packages
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete packages" on public.service_packages;
create policy "Authenticated can delete packages"
  on public.service_packages
  for delete
  to authenticated
  using (true);

grant select on table public.portfolio_images to anon, authenticated;
grant insert, update, delete on table public.portfolio_images to authenticated;

grant select on table public.service_packages to anon, authenticated;
grant insert, update, delete on table public.service_packages to authenticated;

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view portfolio files" on storage.objects;
create policy "Public can view portfolio files"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "Authenticated can upload portfolio files" on storage.objects;
create policy "Authenticated can upload portfolio files"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated can update portfolio files" on storage.objects;
create policy "Authenticated can update portfolio files"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio')
  with check (bucket_id = 'portfolio');

drop policy if exists "Authenticated can delete portfolio files" on storage.objects;
create policy "Authenticated can delete portfolio files"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio');
