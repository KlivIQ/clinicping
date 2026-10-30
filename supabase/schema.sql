-- ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
-- Built by KlivIQ Technologies.
-- Reference schema for the future backend. Mirrors src/lib/models.ts. Not applied yet.

create type app_lang as enum ('en','ta');
create type appointment_source as enum ('whatsapp','manual');
create type appointment_status as enum ('booked','arrived','done','no_show','cancelled');
create type risk_level as enum ('high','medium','low');
create type reminder_state as enum ('queued','sent','delivered','confirmed','no_reply','failed');

create table public.doctors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  preferred_lang app_lang not null default 'en',
  created_at timestamptz not null default now()
);

create table public.practices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.doctors(id) on delete cascade,
  name text not null,
  address text, city text, registration_no text, logo_url text,
  slot_minutes int not null default 15 check (slot_minutes in (10,15,20,30)),
  default_fee_inr int not null default 0,
  whatsapp_connected boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens_at time not null, closes_at time not null
);

create table public.time_blocks (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  starts_at timestamptz not null, ends_at timestamptz not null,
  reason text, is_day_off boolean not null default false
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  full_name text not null,
  phone text not null,
  preferred_lang app_lang not null default 'en',
  visit_count int not null default 0,
  no_show_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (practice_id, phone)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes int not null default 15,
  source appointment_source not null default 'manual',
  status appointment_status not null default 'booked',
  risk_level risk_level not null default 'low',
  risk_reason_key text not null default 'risk.regular',
  fee_inr int not null default 0,
  booked_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  channel text not null default 'whatsapp',
  lang app_lang not null,
  state reminder_state not null default 'queued',
  sent_at timestamptz,
  updated_at timestamptz not null default now(),
  is_manual boolean not null default false
);

create table public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references public.practices(id) on delete cascade,
  phone text not null,
  role text not null default 'assistant',
  created_at timestamptz not null default now()
);

-- Grants + RLS: owner-only access via practices.owner_id = auth.uid()
do $$ declare t text; begin
  foreach t in array array['doctors','practices','working_hours','time_blocks','patients','appointments','reminders','staff_invites'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

create policy "own doctor row" on public.doctors for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own practice" on public.practices for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create or replace function public.owns_practice(p uuid) returns boolean language sql stable security definer set search_path = public
  as $$ select exists(select 1 from practices where id = p and owner_id = auth.uid()) $$;
create policy "practice scoped" on public.working_hours for all using (owns_practice(practice_id)) with check (owns_practice(practice_id));
create policy "practice scoped" on public.time_blocks for all using (owns_practice(practice_id)) with check (owns_practice(practice_id));
create policy "practice scoped" on public.patients for all using (owns_practice(practice_id)) with check (owns_practice(practice_id));
create policy "practice scoped" on public.appointments for all using (owns_practice(practice_id)) with check (owns_practice(practice_id));
create policy "practice scoped" on public.staff_invites for all using (owns_practice(practice_id)) with check (owns_practice(practice_id));
create policy "via appointment" on public.reminders for all
  using (exists(select 1 from appointments a where a.id = appointment_id and owns_practice(a.practice_id)))
  with check (exists(select 1 from appointments a where a.id = appointment_id and owns_practice(a.practice_id)));
