-- Contactos del estudio + mensaje de reserva por WhatsApp.
-- Ejecutar en Supabase: SQL Editor → Run
-- Después de schema.sql y rls-admin.sql.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'annaglopez79@gmail.com';
$$;

create table if not exists public.studio_contacts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (
    kind in ('email', 'whatsapp', 'instagram', 'phone', 'address', 'other')
  ),
  label text not null default '',
  value text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  use_for_booking boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.studio_settings (
  id integer primary key default 1 check (id = 1),
  booking_message_en text not null default
    'Hi, I would like to book an appointment at Ana Beauty Studio.',
  booking_message_es text not null default
    'Hola, me gustaría reservar una cita en Ana Beauty Studio.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists studio_contacts_set_updated_at on public.studio_contacts;
create trigger studio_contacts_set_updated_at
before update on public.studio_contacts
for each row execute function public.set_updated_at();

drop trigger if exists studio_settings_set_updated_at on public.studio_settings;
create trigger studio_settings_set_updated_at
before update on public.studio_settings
for each row execute function public.set_updated_at();

create index if not exists studio_contacts_order_idx
  on public.studio_contacts (display_order asc, created_at asc);

create unique index if not exists studio_contacts_one_booking_idx
  on public.studio_contacts ((true))
  where use_for_booking;

insert into public.studio_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.studio_contacts enable row level security;
alter table public.studio_settings enable row level security;

drop policy if exists "Public can view studio contacts" on public.studio_contacts;
create policy "Public can view studio contacts"
  on public.studio_contacts for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert studio contacts" on public.studio_contacts;
create policy "Admins can insert studio contacts"
  on public.studio_contacts for insert to authenticated
  with check (public.is_studio_admin());

drop policy if exists "Admins can update studio contacts" on public.studio_contacts;
create policy "Admins can update studio contacts"
  on public.studio_contacts for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

drop policy if exists "Admins can delete studio contacts" on public.studio_contacts;
create policy "Admins can delete studio contacts"
  on public.studio_contacts for delete to authenticated
  using (public.is_studio_admin());

drop policy if exists "Public can view studio settings" on public.studio_settings;
create policy "Public can view studio settings"
  on public.studio_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert studio settings" on public.studio_settings;
create policy "Admins can insert studio settings"
  on public.studio_settings for insert to authenticated
  with check (public.is_studio_admin());

drop policy if exists "Admins can update studio settings" on public.studio_settings;
create policy "Admins can update studio settings"
  on public.studio_settings for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

grant select on table public.studio_contacts to anon, authenticated;
grant insert, update, delete on table public.studio_contacts to authenticated;

grant select on table public.studio_settings to anon, authenticated;
grant insert, update on table public.studio_settings to authenticated;
