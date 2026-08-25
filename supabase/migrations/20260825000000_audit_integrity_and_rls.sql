create or replace function public.current_user_is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'OWNER'
      and profiles.is_active = true
  )
$$;

create or replace function public.current_user_is_client()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'CLIENT'
      and profiles.is_active = true
  )
$$;

grant execute on function public.current_user_is_owner() to authenticated;
grant execute on function public.current_user_is_client() to authenticated;

drop policy if exists profiles_client_select_own on public.profiles;
drop policy if exists profiles_owner_select on public.profiles;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_owner_select_clients on public.profiles;
drop policy if exists profiles_client_update_own on public.profiles;
drop policy if exists profiles_owner_update on public.profiles;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_owner_select_clients
on public.profiles
for select
to authenticated
using (public.current_user_is_owner() and role = 'CLIENT');

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
using (
  public.current_user_is_owner()
  and (id = auth.uid() or role = 'CLIENT')
)
with check (
  public.current_user_is_owner()
  and (id = auth.uid() or role = 'CLIENT')
);

alter table public.memberships
drop constraint if exists memberships_status_allowed;

alter table public.memberships
add constraint memberships_status_allowed
check (status::text in ('ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'));

update public.payments as payment
set client_id = membership.client_id
from public.memberships as membership
where membership.id = payment.membership_id
  and payment.client_id <> membership.client_id;

alter table public.payments
validate constraint payments_membership_client_match;

update public.workout_logs as workout
set routine_id = exercise.routine_id
from public.routine_exercises as exercise
where exercise.id = workout.routine_exercise_id
  and workout.routine_id <> exercise.routine_id;

alter table public.workout_logs
validate constraint workout_logs_routine_exercise_match;

drop policy if exists routines_owner_select on public.routines;
drop policy if exists routines_owner_update on public.routines;
drop policy if exists routines_owner_delete on public.routines;

create policy routines_owner_select
on public.routines
for select
to authenticated
using (public.current_user_is_owner() and created_by = auth.uid());

create policy routines_owner_update
on public.routines
for update
to authenticated
using (public.current_user_is_owner() and created_by = auth.uid())
with check (
  public.current_user_is_owner()
  and created_by = auth.uid()
  and owner_id = auth.uid()
);

create policy routines_owner_delete
on public.routines
for delete
to authenticated
using (public.current_user_is_owner() and created_by = auth.uid());

drop policy if exists routine_exercises_owner_select on public.routine_exercises;
drop policy if exists routine_exercises_owner_insert on public.routine_exercises;
drop policy if exists routine_exercises_owner_update on public.routine_exercises;
drop policy if exists routine_exercises_owner_delete on public.routine_exercises;

create policy routine_exercises_owner_select
on public.routine_exercises
for select
to authenticated
using (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
  )
);

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
      and routines.created_by = auth.uid()
  )
);

create policy routine_exercises_owner_update
on public.routine_exercises
for update
to authenticated
using (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
  )
)
with check (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
  )
);

create policy routine_exercises_owner_delete
on public.routine_exercises
for delete
to authenticated
using (
  public.current_user_is_owner()
  and exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
  )
);

alter table public.routine_exercises
drop constraint if exists routine_exercises_unique_position;

alter table public.routine_exercises
add constraint routine_exercises_unique_position
unique (routine_id, position)
deferrable initially immediate;

create or replace function public.reorder_routine_exercise(
  target_exercise_id uuid,
  target_routine_id uuid,
  target_position integer
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  previous_position integer;
  bounded_position integer;
  temporary_position integer;
  exercise_count integer;
begin
  if target_position < 1 then
    raise exception 'La posicion debe ser mayor que cero.';
  end if;

  perform 1
  from public.routine_exercises
  where routine_id = target_routine_id
  for update;

  select position
  into previous_position
  from public.routine_exercises
  where id = target_exercise_id
    and routine_id = target_routine_id;

  if previous_position is null then
    raise exception 'Ejercicio no encontrado.';
  end if;

  select count(*), coalesce(max(position), 0) + 1
  into exercise_count, temporary_position
  from public.routine_exercises
  where routine_id = target_routine_id;

  bounded_position := least(target_position, exercise_count);

  if bounded_position = previous_position then
    return;
  end if;

  set constraints routine_exercises_unique_position deferred;

  update public.routine_exercises
  set position = temporary_position
  where id = target_exercise_id;

  if bounded_position < previous_position then
    update public.routine_exercises
    set position = position + 1
    where routine_id = target_routine_id
      and position >= bounded_position
      and position < previous_position;
  else
    update public.routine_exercises
    set position = position - 1
    where routine_id = target_routine_id
      and position > previous_position
      and position <= bounded_position;
  end if;

  update public.routine_exercises
  set position = bounded_position
  where id = target_exercise_id;
end;
$$;

revoke all on function public.reorder_routine_exercise(uuid, uuid, integer) from public;
grant execute on function public.reorder_routine_exercise(uuid, uuid, integer) to authenticated;
