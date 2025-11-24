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
  user_full_name text;
  user_company_name text;
begin
  -- Extract metadata with fallbacks
  user_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo');
  user_company_name := coalesce(new.raw_user_meta_data->>'company_name', 'Empresa de ' || new.email);

  -- 1. Create a new Company
  insert into public.empresas (nombre, email)
  values (user_company_name, new.email)
  returning id into new_company_id;

  -- 2. Create the User Profile linked to the Company
  insert into public.usuarios (id, email, nombre, empresa_id, rol)
  values (
    new.id,
    new.email,
    user_full_name,
    new_company_id,
    'admin'
  );

  return new;
exception
  when others then
    -- Log error (optional, depends on if you have a logs table)
    raise log 'Error in handle_new_user: %', SQLERRM;
    return new; -- Return new to allow auth user creation even if profile fails (or raise exception to block)
end;
$$;

-- Trigger to call the function on new user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions to the function (crucial for security definer)
grant usage on schema public to postgres,
anon,
authenticated,
service_role;

grant all on table public.empresas to postgres, service_role;

grant all on table public.usuarios to postgres, service_role;