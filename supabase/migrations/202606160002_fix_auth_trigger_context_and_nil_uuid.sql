-- Fix profile creation when called from auth.users triggers where auth.uid() is not available,
-- and accept syntactically valid nil UUIDs such as 00000000-0000-0000-0000-000000000000.

create or replace function public.safe_uuid(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  if value is null or btrim(value) = '' then
    return null;
  end if;

  -- Accept any syntactically valid UUID, including the nil UUID used by some seeded businesses.
  if btrim(value) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return btrim(value)::uuid;
  end if;

  return null;
end;
$$;

create or replace function public.ensure_user_profile_for_auth_user(
  p_user_id uuid,
  p_business_id text default null,
  p_name text default null,
  p_business_name text default null,
  p_industry text default null
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  auth_user record;
  resolved_business_id uuid;
  resolved_name text;
  existing_by_email public.users%rowtype;
  profile public.users%rowtype;
begin
  if p_user_id is null then
    raise exception 'User id is required';
  end if;

  select id, email, raw_user_meta_data
    into auth_user
  from auth.users
  where id = p_user_id;

  if auth_user.id is null then
    raise exception 'Auth user % was not found', p_user_id;
  end if;

  resolved_name := coalesce(
    nullif(btrim(p_name), ''),
    nullif(btrim(auth_user.raw_user_meta_data->>'name'), ''),
    split_part(auth_user.email, '@', 1),
    'Business Owner'
  );

  -- Create business first when a business name is provided and no valid existing UUID is supplied.
  resolved_business_id := public.resolve_profile_business_id(
    p_business_id,
    coalesce(nullif(btrim(p_business_name), ''), nullif(btrim(auth_user.raw_user_meta_data->>'business_name'), '')),
    coalesce(nullif(btrim(p_industry), ''), nullif(btrim(auth_user.raw_user_meta_data->>'industry'), 'Retail'))
  );

  -- Prevent duplicate profile creation if a legacy row exists for the same email.
  select * into existing_by_email
  from public.users
  where email = auth_user.email
    and id <> auth_user.id
  limit 1;

  if existing_by_email.id is not null then
    update public.users
       set id = auth_user.id,
           name = coalesce(nullif(name, ''), resolved_name),
           business_id = coalesce(business_id, resolved_business_id),
           role = coalesce(nullif(role, ''), 'owner')
     where id = existing_by_email.id
     returning * into profile;
  else
    insert into public.users (id, email, name, business_id, role)
    values (auth_user.id, auth_user.email, resolved_name, resolved_business_id, 'owner')
    on conflict (id) do update
      set email = excluded.email,
          name = coalesce(nullif(public.users.name, ''), excluded.name),
          business_id = coalesce(public.users.business_id, excluded.business_id),
          role = coalesce(nullif(public.users.role, ''), 'owner')
    returning * into profile;
  end if;

  if profile.business_id is not null then
    insert into public.business_members (business_id, user_id, role, status)
    values (profile.business_id, auth_user.id, coalesce(nullif(profile.role, ''), 'owner'), 'active')
    on conflict (business_id, user_id) do update
      set role = coalesce(nullif(public.business_members.role, ''), excluded.role),
          status = 'active';
  end if;

  return profile;
end;
$$;

create or replace function public.ensure_user_profile(
  p_business_id text default null,
  p_name text default null,
  p_business_name text default null,
  p_industry text default null
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  return public.ensure_user_profile_for_auth_user(
    auth.uid(),
    p_business_id,
    p_name,
    p_business_name,
    p_industry
  );
end;
$$;

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ignored public.users%rowtype;
begin
  -- auth.uid() is not reliable inside auth.users triggers; use NEW.id explicitly.
  select * into ignored
  from public.ensure_user_profile_for_auth_user(
    new.id,
    new.raw_user_meta_data->>'business_id',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'industry'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_bizguard_profile on auth.users;
create trigger on_auth_user_created_create_bizguard_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

grant execute on function public.safe_uuid(text) to anon, authenticated;
grant execute on function public.ensure_user_profile_for_auth_user(uuid, text, text, text, text) to authenticated;
grant execute on function public.ensure_user_profile(text, text, text, text) to authenticated;
