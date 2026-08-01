-- ─────────────────────────────────────────────────────────────
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.
-- 운세를 뽑을 때마다 이 fortunes 테이블에 자동 저장됩니다.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.fortunes (
  id      uuid primary key default gen_random_uuid(),  -- 행 구분용 자동 ID
  date    date not null default current_date,          -- 날짜 (오늘 날짜 자동 입력)
  name    text,                                         -- 이름 (선택, 비면 비어 있음)
  fortune text not null                                 -- 운세 내용
);

-- Row Level Security(RLS) 켜기 — 켜지 않으면 접근이 막힙니다.
alter table public.fortunes enable row level security;

-- 익명(anon) 사용자가 운세를 저장(insert)할 수 있게 허용
create policy "anon can insert fortunes"
  on public.fortunes
  for insert
  to anon
  with check (true);

-- 익명(anon) 사용자가 저장된 운세(개수 포함)를 읽을(select) 수 있게 허용
create policy "anon can read fortunes"
  on public.fortunes
  for select
  to anon
  using (true);
