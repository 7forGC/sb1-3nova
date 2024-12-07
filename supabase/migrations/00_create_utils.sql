-- Create utility functions first
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;