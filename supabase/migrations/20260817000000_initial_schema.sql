create extension if not exists "pgcrypto";

create type public.profile_role as enum ('OWNER', 'CLIENT');
create type public.membership_status as enum ('ACTIVE', 'PAUSED', 'EXPIRED');
create type public.payment_status as enum ('PAID', 'PENDING', 'FAILED');
create type public.routine_level as enum ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
create type public.routine_objective as enum (
  'STRENGTH',
  'HYPERTROPHY',
  'WEIGHT_LOSS',
  'CONDITIONING'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.profile_role not null default 'CLIENT',
  full_name text not null,
  email text not null unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  plan_name text not null,
  status public.membership_status not null default 'ACTIVE',
  starts_at date not null,
  ends_at date not null,
  price numeric(10, 2) not null default 0,
  currency char(3) not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memberships_valid_dates check (ends_at >= starts_at),
  constraint memberships_price_not_negative check (price >= 0)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(10, 2) not null,
  currency char(3) not null default 'USD',
  status public.payment_status not null default 'PENDING',
  due_at date,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  constraint payments_amount_not_negative check (amount >= 0)
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  level public.routine_level not null default 'BEGINNER',
  objective public.routine_objective not null default 'CONDITIONING',
  duration_minutes integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint routines_duration_positive check (duration_minutes > 0)
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  name text not null,
  muscle_group text,
  equipment text,
  sets integer,
  reps text,
  rest_seconds integer,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  constraint routine_exercises_sets_positive check (sets is null or sets > 0),
  constraint routine_exercises_rest_not_negative check (
    rest_seconds is null or rest_seconds >= 0
  ),
  constraint routine_exercises_position_positive check (position > 0),
  constraint routine_exercises_unique_position unique (routine_id, position)
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  routine_id uuid not null references public.routines(id) on delete cascade,
  performed_at timestamptz not null default now(),
  duration_minutes integer not null,
  completed boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  constraint workout_logs_duration_positive check (duration_minutes > 0)
);

create index memberships_client_id_idx on public.memberships(client_id);
create index payments_membership_id_idx on public.payments(membership_id);
create index payments_client_id_idx on public.payments(client_id);
create index routines_owner_id_idx on public.routines(owner_id);
create index routine_exercises_routine_id_idx on public.routine_exercises(routine_id);
create index workout_logs_client_id_idx on public.workout_logs(client_id);
create index workout_logs_routine_id_idx on public.workout_logs(routine_id);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_logs enable row level security;
