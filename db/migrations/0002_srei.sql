-- SREI tables. The app talks to Postgres only from the server, through
-- functions that always derive the user from the session; there is no
-- client-side database access, so no table is reachable from the browser.

create table if not exists profiles (
  user_id text primary key references "user"(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  country text not null check (country ~ '^[A-Z]{2}$'),
  institution text not null check (char_length(institution) between 2 and 160),
  education_level text not null check (education_level in ('high_school','undergraduate','graduate')),
  -- Under-13s can never be stored: the oldest a person born in this year can be is (now - birth_year).
  birth_year int not null check (birth_year >= 1900 and extract(year from now())::int - birth_year >= 14),
  telegram text check (telegram is null or telegram ~ '^@?[A-Za-z0-9_]{5,32}$'),
  bio text check (bio is null or char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists guardian_consents (
  user_id text primary key references "user"(id) on delete cascade,
  confirmed boolean not null check (confirmed),
  guardian_email text check (guardian_email is null or guardian_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  confirmed_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id bigserial primary key,
  email text not null unique check (email = lower(email)),
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  confirm_token_hash text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);
create index if not exists newsletter_confirm_idx on newsletter_subscribers (confirm_token_hash);

create table if not exists rate_limits (
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (key, window_start)
);

-- Owner dashboard access (Phase 5). Emails are stored lower-case.
create table if not exists admin_users (email text primary key check (email = lower(email)));
insert into admin_users (email) values ('ulashovmuhammadjon1@gmail.com') on conflict do nothing;
