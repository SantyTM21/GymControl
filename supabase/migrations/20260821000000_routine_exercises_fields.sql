alter table public.routine_exercises
add column if not exists suggested_weight numeric(10, 2);

update public.routine_exercises
set
  sets = coalesce(sets, 1),
  reps = coalesce(nullif(reps, ''), '10'),
  rest_seconds = coalesce(rest_seconds, 60);

alter table public.routine_exercises
alter column sets set not null,
alter column reps set not null,
alter column rest_seconds set not null;

alter table public.routine_exercises
drop constraint if exists routine_exercises_suggested_weight_not_negative;

alter table public.routine_exercises
add constraint routine_exercises_suggested_weight_not_negative
check (suggested_weight is null or suggested_weight >= 0);

create index if not exists routine_exercises_routine_position_idx
on public.routine_exercises(routine_id, position);
