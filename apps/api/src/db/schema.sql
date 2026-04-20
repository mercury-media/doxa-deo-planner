create extension if not exists "pgcrypto";

create table if not exists churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'leader', 'member')),
  created_at timestamptz not null default now(),
  unique(church_id, user_id)
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  title text not null,
  service_date date not null,
  starts_at time not null,
  notes text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

create table if not exists service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  position int not null,
  item_type text not null,
  title text not null,
  details jsonb not null default '{}'::jsonb,
  unique(service_id, position)
);

create table if not exists songs (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  title text not null,
  artist text,
  key text,
  bpm int,
  ccli text,
  created_at timestamptz not null default now()
);

create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  team text not null,
  role text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references churches(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  endpoint text not null,
  endpoint_hash text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique(church_id, user_id, endpoint_hash)
);

create index if not exists idx_services_church_date on services(church_id, service_date desc);
create index if not exists idx_songs_church_created_at on songs(church_id, created_at desc);
create index if not exists idx_schedules_church_created_at on schedules(church_id, created_at desc);
