-- TIL Board schema
-- Run this whole file in the Supabase SQL Editor. Safe to re-run.

create table if not exists public.til_posts (
  id uuid primary key default gen_random_uuid(),
  -- btrim: whitespace-only values are rejected at the DB level too (CLAUDE.md rule 6)
  nickname text not null check (char_length(btrim(nickname)) between 1 and 20),
  content  text not null check (char_length(btrim(content))  between 1 and 140),
  created_at timestamptz not null default now()
);

-- Latest-first listing (order by created_at desc limit 50)
create index if not exists til_posts_created_at_idx
  on public.til_posts (created_at desc);

-- Table privileges: newer Supabase projects don't auto-grant API roles on new tables.
-- Grant only what the app needs (read + insert). RLS below still applies on top of this.
grant select, insert on public.til_posts to anon, authenticated;

-- Row Level Security: anyone can read and insert. No update/delete policies (no deletion in v1).
alter table public.til_posts enable row level security;

drop policy if exists "anyone can read" on public.til_posts;
create policy "anyone can read" on public.til_posts
  for select using (true);

drop policy if exists "anyone can insert" on public.til_posts;
create policy "anyone can insert" on public.til_posts
  for insert with check (true);

-- Reject a post whose content equals the most recent post (anti-spam, CLAUDE.md rule 6)
create or replace function public.reject_duplicate_content()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  last_content text;
begin
  select p.content into last_content
  from public.til_posts p
  order by p.created_at desc
  limit 1;

  if last_content is not null and btrim(last_content) = btrim(new.content) then
    raise exception 'duplicate_content' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists til_posts_reject_duplicate on public.til_posts;
create trigger til_posts_reject_duplicate
  before insert on public.til_posts
  for each row execute function public.reject_duplicate_content();
