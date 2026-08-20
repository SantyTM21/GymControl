alter table public.payments
add column if not exists payment_date date,
add column if not exists payment_method text,
add column if not exists notes text,
add column if not exists updated_at timestamptz not null default now();

update public.payments
set payment_date = coalesce(payment_date, paid_at::date, due_at, created_at::date)
where payment_date is null;

update public.payments
set payment_method = coalesce(nullif(payment_method, ''), 'Efectivo')
where payment_method is null;

alter table public.payments
alter column payment_date set default current_date,
alter column payment_date set not null,
alter column payment_method set default 'Efectivo',
alter column payment_method set not null;

create index if not exists payments_payment_date_idx
on public.payments(payment_date desc);

create unique index if not exists memberships_id_client_id_key
on public.memberships(id, client_id);

alter table public.payments
drop constraint if exists payments_membership_client_match;

alter table public.payments
add constraint payments_membership_client_match
foreign key (membership_id, client_id)
references public.memberships(id, client_id)
on delete cascade
not valid;
