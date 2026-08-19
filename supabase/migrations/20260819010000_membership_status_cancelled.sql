alter type public.membership_status add value if not exists 'CANCELLED';

alter table public.memberships
drop constraint if exists memberships_status_allowed;

update public.memberships
set status = 'EXPIRED'
where status::text = 'PAUSED';

alter table public.memberships
add constraint memberships_status_allowed
check (status::text in ('ACTIVE', 'EXPIRED', 'CANCELLED'));
