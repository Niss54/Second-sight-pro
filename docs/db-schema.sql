create extension if not exists vector;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.medical_cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  case_label text,
  primary_condition text not null,
  patient_age int,
  language text not null default 'en',
  comorbidities jsonb not null default '[]',
  symptoms jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctor_opinions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.medical_cases(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  doctor_name text not null,
  specialty text not null,
  urgency text not null,
  diagnosis text not null,
  treatment text not null,
  prescriptions jsonb not null default '[]',
  tests jsonb not null default '[]',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.medical_cases(id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  ocr_status text not null default 'pending',
  ocr_confidence numeric,
  extracted_json jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid not null references public.medical_cases(id) on delete cascade,
  final_score int not null,
  risk_tier text not null,
  findings jsonb not null,
  citations jsonb not null default '[]',
  multilingual_summaries jsonb not null default '{}',
  report_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.medical_cases(id) on delete set null,
  language text not null,
  livekit_room text not null,
  transcript jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.medical_evidence (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  source_url text,
  corpus_category text not null,
  disease text,
  specialty text,
  urgency text,
  condition text,
  confidence numeric not null default 0.8,
  content text not null,
  metadata jsonb not null default '{}',
  embedding vector(1536),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.medical_cases enable row level security;
alter table public.doctor_opinions enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.analysis_results enable row level security;
alter table public.voice_sessions enable row level security;
alter table public.medical_evidence enable row level security;

create policy "users can read self" on public.users for select using (auth.uid() = id);
create policy "users can update self" on public.users for update using (auth.uid() = id);

create policy "case owner access" on public.medical_cases for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "opinion owner access" on public.doctor_opinions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "file owner access" on public.uploaded_files for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "analysis owner access" on public.analysis_results for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "voice owner access" on public.voice_sessions for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "evidence readable by authenticated users" on public.medical_evidence for select using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('case-uploads', 'case-uploads', false)
on conflict (id) do nothing;
