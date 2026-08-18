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

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.current_user_is_owner() to authenticated;

create policy profiles_select_own_or_owner
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.current_user_is_owner());

create policy profiles_owner_update
on public.profiles
for update
to authenticated
using (public.current_user_is_owner())
with check (public.current_user_is_owner());

create policy memberships_select_own_or_owner
on public.memberships
for select
to authenticated
using (client_id = auth.uid() or public.current_user_is_owner());

create policy memberships_owner_insert
on public.memberships
for insert
to authenticated
with check (public.current_user_is_owner());

create policy memberships_owner_update
on public.memberships
for update
to authenticated
using (public.current_user_is_owner())
with check (public.current_user_is_owner());

create policy memberships_owner_delete
on public.memberships
for delete
to authenticated
using (public.current_user_is_owner());

create policy payments_select_own_or_owner
on public.payments
for select
to authenticated
using (client_id = auth.uid() or public.current_user_is_owner());

create policy payments_owner_insert
on public.payments
for insert
to authenticated
with check (public.current_user_is_owner());

create policy payments_owner_update
on public.payments
for update
to authenticated
using (public.current_user_is_owner())
with check (public.current_user_is_owner());

create policy payments_owner_delete
on public.payments
for delete
to authenticated
using (public.current_user_is_owner());

create policy routines_select_authenticated
on public.routines
for select
to authenticated
using (true);

create policy routines_owner_insert
on public.routines
for insert
to authenticated
with check (public.current_user_is_owner() and owner_id = auth.uid());

create policy routines_owner_update
on public.routines
for update
to authenticated
using (public.current_user_is_owner() and owner_id = auth.uid())
with check (public.current_user_is_owner() and owner_id = auth.uid());

create policy routines_owner_delete
on public.routines
for delete
to authenticated
using (public.current_user_is_owner() and owner_id = auth.uid());

create policy routine_exercises_select_authenticated
on public.routine_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
  )
);

create policy routine_exercises_owner_insert
on public.routine_exercises
for insert
to authenticated
with check (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.owner_id = auth.uid()
      and public.current_user_is_owner()
  )
);

create policy routine_exercises_owner_update
on public.routine_exercises
for update
to authenticated
using (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.owner_id = auth.uid()
      and public.current_user_is_owner()
  )
)
with check (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.owner_id = auth.uid()
      and public.current_user_is_owner()
  )
);

create policy routine_exercises_owner_delete
on public.routine_exercises
for delete
to authenticated
using (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.owner_id = auth.uid()
      and public.current_user_is_owner()
  )
);

create policy workout_logs_select_own_or_owner
on public.workout_logs
for select
to authenticated
using (client_id = auth.uid() or public.current_user_is_owner());

create policy workout_logs_client_insert
on public.workout_logs
for insert
to authenticated
with check (client_id = auth.uid());

create policy workout_logs_client_update
on public.workout_logs
for update
to authenticated
using (client_id = auth.uid())
with check (client_id = auth.uid());
