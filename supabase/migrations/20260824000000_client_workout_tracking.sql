alter table public.workout_logs
add column if not exists routine_exercise_id uuid references public.routine_exercises(id) on delete cascade,
add column if not exists completed_sets integer not null default 0,
add column if not exists completed_reps integer not null default 0,
add column if not exists used_weight numeric(10, 2) not null default 0;

alter table public.workout_logs
alter column duration_minutes set default 1;

alter table public.workout_logs
drop constraint if exists workout_logs_completed_sets_not_negative,
drop constraint if exists workout_logs_completed_reps_not_negative,
drop constraint if exists workout_logs_used_weight_not_negative,
drop constraint if exists workout_logs_routine_exercise_match;

alter table public.workout_logs
add constraint workout_logs_completed_sets_not_negative check (completed_sets >= 0),
add constraint workout_logs_completed_reps_not_negative check (completed_reps >= 0),
add constraint workout_logs_used_weight_not_negative check (used_weight >= 0);

create unique index if not exists routine_exercises_id_routine_id_key
on public.routine_exercises(id, routine_id);

alter table public.workout_logs
add constraint workout_logs_routine_exercise_match
foreign key (routine_exercise_id, routine_id)
references public.routine_exercises(id, routine_id)
on delete cascade
not valid;

create index if not exists workout_logs_client_performed_idx
on public.workout_logs(client_id, performed_at desc);

create index if not exists workout_logs_routine_exercise_id_idx
on public.workout_logs(routine_exercise_id);

drop policy if exists workout_logs_select_own_or_owner on public.workout_logs;
drop policy if exists workout_logs_client_insert on public.workout_logs;
drop policy if exists workout_logs_client_update on public.workout_logs;

create policy workout_logs_select_own
on public.workout_logs
for select
to authenticated
using (client_id = auth.uid() and public.current_user_role() = 'CLIENT');

create policy workout_logs_client_insert
on public.workout_logs
for insert
to authenticated
with check (client_id = auth.uid() and public.current_user_role() = 'CLIENT');

revoke update, delete on public.workout_logs from authenticated;
grant select, insert on public.workout_logs to authenticated;
