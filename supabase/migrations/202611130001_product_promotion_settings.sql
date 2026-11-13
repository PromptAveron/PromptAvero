insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-samples', 'product-samples', true, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product sample PDFs" on storage.objects;
create policy "Public can view product sample PDFs" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-samples');

drop policy if exists "Admins upload product sample PDFs" on storage.objects;
create policy "Admins upload product sample PDFs" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'product-samples'
    and (storage.foldername(name))[1] = 'samples'
    and public.is_promptavero_admin()
  );

drop policy if exists "Admins update product sample PDFs" on storage.objects;
create policy "Admins update product sample PDFs" on storage.objects
  for update to authenticated using (
    bucket_id = 'product-samples'
    and (storage.foldername(name))[1] = 'samples'
    and public.is_promptavero_admin()
  ) with check (
    bucket_id = 'product-samples'
    and (storage.foldername(name))[1] = 'samples'
    and public.is_promptavero_admin()
  );

drop policy if exists "Admins delete product sample PDFs" on storage.objects;
create policy "Admins delete product sample PDFs" on storage.objects
  for delete to authenticated using (
    bucket_id = 'product-samples'
    and (storage.foldername(name))[1] = 'samples'
    and public.is_promptavero_admin()
  );

create or replace function public.get_public_site_settings()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select jsonb_strip_nulls(jsonb_build_object(
        'site_name', value -> 'site_name',
        'tagline', value -> 'tagline',
        'logo_url', value -> 'logo_url',
        'favicon_url', value -> 'favicon_url',
        'google_analytics_id', value -> 'google_analytics_id',
        'google_search_console_verification', value -> 'google_search_console_verification',
        'bing_verification_code', value -> 'bing_verification_code',
        'product_original_price_cents', value -> 'product_original_price_cents',
        'product_discount_percentage', value -> 'product_discount_percentage',
        'product_promotion_enabled', value -> 'product_promotion_enabled',
        'product_gumroad_url', value -> 'product_gumroad_url',
        'product_sample_pdf_url', value -> 'product_sample_pdf_url',
        'product_popup_enabled', value -> 'product_popup_enabled',
        'product_popup_delay_seconds', value -> 'product_popup_delay_seconds'
      ))
      from public.site_settings
      where key = 'site'
      limit 1
    ),
    '{}'::jsonb
  );
$$;

revoke all on function public.get_public_site_settings() from public;
grant execute on function public.get_public_site_settings() to anon, authenticated;

notify pgrst, 'reload schema';
