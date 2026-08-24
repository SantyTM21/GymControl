create or replace function public.current_user_role()
returns public.profile_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_user_is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() = 'OWNER'
$$;

create or replace function public.current_user_is_client()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() = 'CLIENT'
$$;

create or replace function public.profile_self_update_allowed(
  target_id uuid,
  target_role public.profile_role,
  target_is_active boolean,
  target_deactivated_at timestamptz
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = target_id
      and profiles.id = auth.uid()
      and profiles.role = 'CLIENT'
      and target_role = profiles.role
      and target_is_active = profiles.is_active
      and target_deactivated_at is not distinct from profiles.deactivated_at
  )
$$;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_is_owner() to authenticated;
grant execute on function public.current_user_is_client() to authenticated;
grant execute on function public.profile_self_update_allowed(
  uuid,
  public.profile_role,
  boolean,
  timestamptz
) to authenticated;

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_logs enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.memberships from anon, authenticated;
revoke all on public.payments from anon, authenticated;
revoke all on public.routines from anon, authenticated;
revoke all on public.routine_exercises from anon, authenticated;
revoke all on public.workout_logs from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (
  full_name,
  email,
  avatar_url,
  is_active,
  deactivated_at,
  updated_at
) on public.profiles to authenticated;

grant select, insert, update, delete on public.memberships to authenticated;
grant select, insert, update, delete on public.payments to authenticated;
grant select on public.routines to anon;
grant select, insert, update, delete on public.routines to authenticated;
grant select on public.routine_exercises to anon;
grant select, insert, update, delete on public.routine_exercises to authenticated;
grant select, insert on public.workout_logs to authenticated;

drop policy if exists profiles_select_own_or_owner on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;
drop policy if exists profiles_client_update_own on public.profiles;
drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_client_select_own on public.profiles;

create policy profiles_client_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid() and public.current_user_is_client());

create policy profiles_owner_select
on public.profiles
for select
to authenticated
using (public.current_user_is_owner());

create policy profiles_client_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid() and public.current_user_is_client())
with check (
  public.profile_self_update_allowed(id, role, is_active, deactivated_at)
);

create policy profiles_owner_update
on public.profiles
for update
to authenticated
using (public.current_user_is_owner())
with check (public.current_user_is_owner());

drop policy if exists memberships_select_own_or_owner on public.memberships;
drop policy if exists memberships_owner_insert on public.memberships;
drop policy if exists memberships_owner_update on public.memberships;
drop policy if exists memberships_owner_delete on public.memberships;
drop policy if exists memberships_client_select_own on public.memberships;
drop policy if exists memberships_owner_select on public.memberships;

create policy memberships_client_select_own
on public.memberships
for select
to authenticated
using (client_id = auth.uid() and public.current_user_is_client());

create policy memberships_owner_select
on public.memberships
for select
to authenticated
using (public.current_user_is_owner());

create policy memberships_owner_insert
on public.memberships
for insert
to authenticated
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.profiles
    where profiles.id = memberships.client_id
      and profiles.role = 'CLIENT'
  )
);

create policy memberships_owner_update
on public.memberships
for update
to authenticated
using (public.current_user_is_owner())
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.profiles
    where profiles.id = memberships.client_id
      and profiles.role = 'CLIENT'
  )
);

create policy memberships_owner_delete
on public.memberships
for delete
to authenticated
using (public.current_user_is_owner());

drop policy if exists payments_select_own_or_owner on public.payments;
drop policy if exists payments_owner_insert on public.payments;
drop policy if exists payments_owner_update on public.payments;
drop policy if exists payments_owner_delete on public.payments;
drop policy if exists payments_client_select_own on public.payments;
drop policy if exists payments_owner_select on public.payments;

create policy payments_client_select_own
on public.payments
for select
to authenticated
using (client_id = auth.uid() and public.current_user_is_client());

create policy payments_owner_select
on public.payments
for select
to authenticated
using (public.current_user_is_owner());

create policy payments_owner_insert
on public.payments
for insert
to authenticated
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.memberships
    where memberships.id = payments.membership_id
      and memberships.client_id = payments.client_id
  )
);

create policy payments_owner_update
on public.payments
for update
to authenticated
using (public.current_user_is_owner())
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.memberships
    where memberships.id = payments.membership_id
      and memberships.client_id = payments.client_id
  )
);

create policy payments_owner_delete
on public.payments
for delete
to authenticated
using (public.current_user_is_owner());

drop policy if exists routines_select_authenticated on public.routines;
drop policy if exists routines_select_published on public.routines;
drop policy if exists routines_owner_select_own on public.routines;
drop policy if exists routines_owner_select on public.routines;
drop policy if exists routines_owner_insert on public.routines;
drop policy if exists routines_owner_update on public.routines;
drop policy if exists routines_owner_delete on public.routines;

create policy routines_select_published
on public.routines
for select
to anon, authenticated
using (is_published = true);

create policy routines_owner_select
on public.routines
for select
to authenticated
using (public.current_user_is_owner());

create policy routines_owner_insert
on public.routines
for insert
to authenticated
with check (
  public.current_user_is_owner()
  and owner_id = auth.uid()
  and created_by = auth.uid()
);

create policy routines_owner_update
on public.routines
for update
to authenticated
using (public.current_user_is_owner())
with check (public.current_user_is_owner());

create policy routines_owner_delete
on public.routines
for delete
to authenticated
using (public.current_user_is_owner());

drop policy if exists routine_exercises_select_authenticated on public.routine_exercises;
drop policy if exists routine_exercises_select_published on public.routine_exercises;
drop policy if exists routine_exercises_owner_select_own on public.routine_exercises;
drop policy if exists routine_exercises_owner_select on public.routine_exercises;
drop policy if exists routine_exercises_owner_insert on public.routine_exercises;
drop policy if exists routine_exercises_owner_update on public.routine_exercises;
drop policy if exists routine_exercises_owner_delete on public.routine_exercises;

create policy routine_exercises_select_published
on public.routine_exercises
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.is_published = true
  )
);

create policy routine_exercises_owner_select
on public.routine_exercises
for select
to authenticated
using (public.current_user_is_owner());

create policy routine_exercises_owner_insert
on public.routine_exercises
for insert
to authenticated
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
  )
);

create policy routine_exercises_owner_update
on public.routine_exercises
for update
to authenticated
using (public.current_user_is_owner())
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
  )
);

create policy routine_exercises_owner_delete
on public.routine_exercises
for delete
to authenticated
using (public.current_user_is_owner());

drop policy if exists workout_logs_select_own_or_owner on public.workout_logs;
drop policy if exists workout_logs_select_own on public.workout_logs;
drop policy if exists workout_logs_client_insert on public.workout_logs;
drop policy if exists workout_logs_client_update on public.workout_logs;
drop policy if exists workout_logs_client_select_own on public.workout_logs;

create policy workout_logs_client_select_own
on public.workout_logs
for select
to authenticated
using (client_id = auth.uid() and public.current_user_is_client());

create policy workout_logs_client_insert
on public.workout_logs
for insert
to authenticated
with check (
  client_id = auth.uid()
  and public.current_user_is_client()
  and routine_exercise_id is not null
  and exists (
    select 1
    from public.routine_exercises
    join public.routines on routines.id = routine_exercises.routine_id
    where routine_exercises.id = workout_logs.routine_exercise_id
      and routine_exercises.routine_id = workout_logs.routine_id
      and routines.is_published = true
  )
);
