alter table public.routines
add column if not exists created_by uuid references public.profiles(id) on delete cascade,
add column if not exists is_published boolean not null default false;

update public.routines
set created_by = owner_id
where created_by is null;

alter table public.routines
alter column created_by set not null;

create index if not exists routines_created_by_idx
on public.routines(created_by);

create index if not exists routines_published_created_at_idx
on public.routines(is_published, created_at desc);

drop policy if exists routines_select_authenticated on public.routines;
drop policy if exists routines_owner_insert on public.routines;
drop policy if exists routines_owner_update on public.routines;
drop policy if exists routines_owner_delete on public.routines;

create policy routines_select_published
on public.routines
for select
to anon, authenticated
using (is_published = true);

create policy routines_owner_select_own
on public.routines
for select
to authenticated
using (public.current_user_is_owner() and created_by = auth.uid());

create policy routines_owner_insert
on public.routines
for insert
to authenticated
with check (
  public.current_user_is_owner()
  and created_by = auth.uid()
  and owner_id = auth.uid()
);

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

drop policy if exists routine_exercises_select_authenticated on public.routine_exercises;
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

create policy routine_exercises_owner_select_own
on public.routine_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
      and public.current_user_is_owner()
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
      and routines.created_by = auth.uid()
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
      and routines.created_by = auth.uid()
      and public.current_user_is_owner()
  )
)
with check (
  exists (
    select 1
    from public.routines
    where routines.id = routine_exercises.routine_id
      and routines.created_by = auth.uid()
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
      and routines.created_by = auth.uid()
      and public.current_user_is_owner()
  )
);

grant select on public.routines to anon, authenticated;
grant insert, update, delete on public.routines to authenticated;
grant select on public.routine_exercises to anon, authenticated;
grant insert, update, delete on public.routine_exercises to authenticated;
