-- Restrict writes to the studio admin email.
-- Run in Supabase SQL Editor after schema.sql.

create or replace function public.is_studio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'annaglopez79@gmail.com';
$$;

drop policy if exists "Authenticated can insert portfolio" on public.portfolio_images;
drop policy if exists "Authenticated can update portfolio" on public.portfolio_images;
drop policy if exists "Authenticated can delete portfolio" on public.portfolio_images;
drop policy if exists "Admins can insert portfolio" on public.portfolio_images;
drop policy if exists "Admins can update portfolio" on public.portfolio_images;
drop policy if exists "Admins can delete portfolio" on public.portfolio_images;

create policy "Admins can insert portfolio"
  on public.portfolio_images for insert to authenticated
  with check (public.is_studio_admin());

create policy "Admins can update portfolio"
  on public.portfolio_images for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

create policy "Admins can delete portfolio"
  on public.portfolio_images for delete to authenticated
  using (public.is_studio_admin());

drop policy if exists "Authenticated can insert packages" on public.service_packages;
drop policy if exists "Authenticated can update packages" on public.service_packages;
drop policy if exists "Authenticated can delete packages" on public.service_packages;
drop policy if exists "Admins can insert packages" on public.service_packages;
drop policy if exists "Admins can update packages" on public.service_packages;
drop policy if exists "Admins can delete packages" on public.service_packages;

create policy "Admins can insert packages"
  on public.service_packages for insert to authenticated
  with check (public.is_studio_admin());

create policy "Admins can update packages"
  on public.service_packages for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

create policy "Admins can delete packages"
  on public.service_packages for delete to authenticated
  using (public.is_studio_admin());

drop policy if exists "Authenticated can upload portfolio files" on storage.objects;
drop policy if exists "Authenticated can update portfolio files" on storage.objects;
drop policy if exists "Authenticated can delete portfolio files" on storage.objects;
drop policy if exists "Admins can upload portfolio files" on storage.objects;
drop policy if exists "Admins can update portfolio files" on storage.objects;
drop policy if exists "Admins can delete portfolio files" on storage.objects;

create policy "Admins can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_studio_admin());

create policy "Admins can update portfolio files"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.is_studio_admin())
  with check (bucket_id = 'portfolio' and public.is_studio_admin());

create policy "Admins can delete portfolio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_studio_admin());

drop policy if exists "Admins can insert studio contacts" on public.studio_contacts;
drop policy if exists "Admins can update studio contacts" on public.studio_contacts;
drop policy if exists "Admins can delete studio contacts" on public.studio_contacts;
drop policy if exists "Admins can insert studio settings" on public.studio_settings;
drop policy if exists "Admins can update studio settings" on public.studio_settings;

create policy "Admins can insert studio contacts"
  on public.studio_contacts for insert to authenticated
  with check (public.is_studio_admin());

create policy "Admins can update studio contacts"
  on public.studio_contacts for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());

create policy "Admins can delete studio contacts"
  on public.studio_contacts for delete to authenticated
  using (public.is_studio_admin());

create policy "Admins can insert studio settings"
  on public.studio_settings for insert to authenticated
  with check (public.is_studio_admin());

create policy "Admins can update studio settings"
  on public.studio_settings for update to authenticated
  using (public.is_studio_admin())
  with check (public.is_studio_admin());
