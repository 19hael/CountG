-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_company_id uuid;
begin
  -- 1. Create a new Company
  -- We use the company_name from metadata, or fallback to "Empresa de [Email]"
  insert into public.empresas (nombre, email)
  values (
    coalesce(new.raw_user_meta_data->>'company_name', 'Empresa de ' || new.email),
    new.email
  )
  returning id into new_company_id;

  -- 2. Create the User Profile linked to the Company
  insert into public.usuarios (id, email, nombre, empresa_id, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuario'),
    new_company_id,
    'admin'
  );

  return new;
end;
$$;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();