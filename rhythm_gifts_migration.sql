-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query),
-- on the SAME project Scripture Scout already uses (profiles/friends/notifications
-- already exist there — this just adds the one table Rhythm itself needs).

create table if not exists rhythm_gifts (
  id bigint generated always as identity primary key,
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  sheep_kind text not null,               -- 'color' or 'special'
  sheep_key text not null,                -- color index (e.g. '3') or special key (e.g. 'ninja')
  message text,
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists rhythm_gifts_recipient_idx on rhythm_gifts(recipient_id);

alter table rhythm_gifts enable row level security;

create policy "Users can view gifts sent to or by them"
  on rhythm_gifts for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send gifts"
  on rhythm_gifts for insert
  with check (auth.uid() = sender_id);

-- Recipients can only flip claimed to true on their own incoming gifts — never
-- edit the sheep/sender/message, and senders can't touch it after sending.
create policy "Recipients can mark their gifts claimed"
  on rhythm_gifts for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
