-- BizGuard auth/profile repair: defensive UUID handling, idempotent profile creation,
-- and RLS policies for signup/login/profile access.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Ensure public.users matches the intended auth profile model while remaining
-- compatible with existing nullable business_id deployments.
alter table public.users alter column business_id drop not null;
alter table public.users alter column role set default 'owner';

-- Add an auth.users FK on public.users.id where possible. This is safe if it
-- already exists; if legacy data prevents it, clean orphan public.users rows first.
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where constraint_schema = 'public'
      and table_name = 'users'
      and constraint_name = 'users_id_auth_users_fkey'
  ) then
    alter table public.users
      add constraint users_id_auth_users_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
exception
  when foreign_key_violation then
    raise notice 'Could not add users_id_auth_users_fkey because legacy public.users rows do not match auth.users. Remove or repair orphan rows, then re-run this migration.';
  when duplicate_object then
    null;
end $$;

create or replace function public.safe_uuid(value text)
returns uuid
language plpgsql
immutable
as $$
begin
  if value is null or btrim(value) = '' then
    return null;
  end if;

  if btrim(value) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    return btrim(value)::uuid;
  end if;

  return null;
end;
$$;

create or replace function public.resolve_profile_business_id(
  p_business_id text default null,
  p_business_name text default null,
  p_industry text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate_business_id uuid;
  created_business_id uuid;
begin
  candidate_business_id := public.safe_uuid(p_business_id);

  if candidate_business_id is not null and exists (
    select 1 from public.businesses where id = candidate_business_id
  ) then
    return candidate_business_id;
  end if;

  -- Never return a non-existent UUID. That is the direct cause of users_business_id_fkey failures.
  if candidate_business_id is not null then
    return null;
  end if;

  if p_business_name is not null and btrim(p_business_name) <> '' then
    insert into public.businesses (name, industry)
    values (btrim(p_business_name), coalesce(nullif(btrim(p_industry), ''), 'Retail'))
    returning id into created_business_id;

    return created_business_id;
  end if;

  return null;
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
declare
  auth_user record;
  resolved_business_id uuid;
  resolved_name text;
  existing_by_email public.users%rowtype;
  profile public.users%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id, email, raw_user_meta_data
    into auth_user
  from auth.users
  where id = auth.uid();

  if auth_user.id is null then
    raise exception 'Authenticated user was not found';
  end if;

  resolved_name := coalesce(
    nullif(btrim(p_name), ''),
    nullif(btrim(auth_user.raw_user_meta_data->>'name'), ''),
    split_part(auth_user.email, '@', 1),
    'Business Owner'
  );

  resolved_business_id := public.resolve_profile_business_id(
    p_business_id,
    coalesce(nullif(btrim(p_business_name), ''), nullif(btrim(auth_user.raw_user_meta_data->>'business_name'), '')),
    coalesce(nullif(btrim(p_industry), ''), nullif(btrim(auth_user.raw_user_meta_data->>'industry'), 'Retail'))
  );

  -- Repair legacy duplicate-by-email rows that were created with a random UUID
  -- instead of auth.users.id. This avoids duplicate insert attempts and email conflicts.
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

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ignored public.users%rowtype;
begin
  -- Idempotent and UUID-safe. Empty/invalid business_id metadata becomes NULL;
  -- valid existing business_id is used; otherwise a named business is created if provided.
  select * into ignored
  from public.ensure_user_profile(
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
grant execute on function public.resolve_profile_business_id(text, text, text) to authenticated;
grant execute on function public.ensure_user_profile(text, text, text, text) to authenticated;

alter table public.users enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;

-- Replace/ensure the minimum profile policies needed for signup/login/profile retrieval.
drop policy if exists users_select_self_or_member on public.users;
drop policy if exists users_update_self on public.users;
drop policy if exists users_insert_self on public.users;

create policy users_select_self_or_member
  on public.users for select
  using (id = auth.uid() or (business_id is not null and public.is_business_member(business_id)));

create policy users_insert_self
  on public.users for insert
  with check (id = auth.uid() and (business_id is null or exists (select 1 from public.businesses b where b.id = business_id)));

create policy users_update_self
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid() and (business_id is null or exists (select 1 from public.businesses b where b.id = business_id)));

drop policy if exists businesses_select_member on public.businesses;
drop policy if exists businesses_update_manager on public.businesses;
drop policy if exists businesses_insert_authenticated on public.businesses;

create policy businesses_select_member
  on public.businesses for select
  using (public.is_business_member(id));

create policy businesses_insert_authenticated
  on public.businesses for insert
  with check (auth.uid() is not null);

create policy businesses_update_manager
  on public.businesses for update
  using (public.is_business_member(id, 'manager'))
  with check (public.is_business_member(id, 'manager'));
