alter table public.profiles
add column if not exists is_active boolean not null default true,
add column if not exists deactivated_at timestamptz;

create index if not exists profiles_role_active_idx
on public.profiles(role, is_active);

revoke update on public.profiles from authenticated;

grant update (
  full_name,
  email,
  avatar_url,
  is_active,
  deactivated_at,
  updated_at
) on public.profiles to authenticated;
