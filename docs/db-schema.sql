-- ==============================================================================
-- SecondSight Pro Database Schema & Security Configuration
-- Target: Supabase PostgreSQL 17 + pgvector (extensions schema)
-- Row Level Security (RLS) Enabled on All Tables & Storage Buckets
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- 2. Security Hardening: Revoke execute on internal trigger functions from public roles
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;

-- 3. Core Tables
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medical_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_label text,
  primary_condition text NOT NULL,
  patient_age int,
  language text NOT NULL DEFAULT 'en',
  comorbidities jsonb NOT NULL DEFAULT '[]'::jsonb,
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_opinions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.medical_cases(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_name text NOT NULL,
  specialty text NOT NULL,
  urgency text NOT NULL,
  diagnosis text NOT NULL,
  treatment text NOT NULL,
  prescriptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  tests jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.medical_cases(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  ocr_status text NOT NULL DEFAULT 'pending',
  ocr_confidence numeric,
  extracted_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES public.medical_cases(id) ON DELETE CASCADE,
  final_score int NOT NULL,
  risk_tier text NOT NULL,
  findings jsonb NOT NULL,
  citations jsonb NOT NULL DEFAULT '[]'::jsonb,
  multilingual_summaries jsonb NOT NULL DEFAULT '{}'::jsonb,
  report_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.voice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id uuid REFERENCES public.medical_cases(id) ON DELETE SET NULL,
  language text NOT NULL,
  livekit_room text NOT NULL,
  transcript jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.medical_evidence (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  source text NOT NULL,
  source_url text,
  snippet text,
  content text,
  reference text,
  corpus_category text NOT NULL DEFAULT 'general',
  disease text,
  specialty text,
  urgency text,
  condition text,
  confidence numeric NOT NULL DEFAULT 0.8,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding extensions.vector(1536),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_evidence ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Optimized with (select auth.uid()) for InitPlan caching)
DROP POLICY IF EXISTS "users can read self" ON public.users;
CREATE POLICY "users can read self" ON public.users FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "users can insert self" ON public.users;
CREATE POLICY "users can insert self" ON public.users FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "users can update self" ON public.users;
CREATE POLICY "users can update self" ON public.users FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "case owner access" ON public.medical_cases;
CREATE POLICY "case owner access" ON public.medical_cases FOR ALL USING ((select auth.uid()) = owner_id) WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "opinion owner access" ON public.doctor_opinions;
CREATE POLICY "opinion owner access" ON public.doctor_opinions FOR ALL USING ((select auth.uid()) = owner_id) WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "file owner access" ON public.uploaded_files;
CREATE POLICY "file owner access" ON public.uploaded_files FOR ALL USING ((select auth.uid()) = owner_id) WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "analysis owner access" ON public.analysis_results;
CREATE POLICY "analysis owner access" ON public.analysis_results FOR ALL USING ((select auth.uid()) = owner_id) WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "voice owner access" ON public.voice_sessions;
CREATE POLICY "voice owner access" ON public.voice_sessions FOR ALL USING ((select auth.uid()) = owner_id) WITH CHECK ((select auth.uid()) = owner_id);

-- Medical Evidence: Public guidelines (WHO, ICMR, AIIMS) readable by all users
DROP POLICY IF EXISTS "evidence readable by authenticated users" ON public.medical_evidence;
DROP POLICY IF EXISTS "evidence readable by all users" ON public.medical_evidence;
CREATE POLICY "evidence readable by all users" ON public.medical_evidence FOR SELECT USING (true);

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_medical_cases_owner ON public.medical_cases(owner_id);
CREATE INDEX IF NOT EXISTS idx_doctor_opinions_case ON public.doctor_opinions(case_id);
CREATE INDEX IF NOT EXISTS idx_doctor_opinions_owner ON public.doctor_opinions(owner_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_case ON public.uploaded_files(case_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_owner ON public.uploaded_files(owner_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_case ON public.analysis_results(case_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_owner ON public.analysis_results(owner_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_case ON public.voice_sessions(case_id);
CREATE INDEX IF NOT EXISTS idx_voice_sessions_owner ON public.voice_sessions(owner_id);
CREATE INDEX IF NOT EXISTS idx_medical_evidence_category ON public.medical_evidence(corpus_category);

-- HNSW Vector Index for fast cosine similarity retrieval
CREATE INDEX IF NOT EXISTS idx_medical_evidence_embedding ON public.medical_evidence USING hnsw (embedding extensions.vector_cosine_ops);

-- 7. Storage Bucket & Object Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-uploads', 'case-uploads', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can read own case-uploads" ON storage.objects;
CREATE POLICY "Users can read own case-uploads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'case-uploads' AND ((select auth.uid())::text = (storage.foldername(name))[1] OR (select auth.role()) = 'authenticated')
);

DROP POLICY IF EXISTS "Users can upload to case-uploads" ON storage.objects;
CREATE POLICY "Users can upload to case-uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'case-uploads' AND (select auth.role()) = 'authenticated'
);

DROP POLICY IF EXISTS "Users can update own case-uploads" ON storage.objects;
CREATE POLICY "Users can update own case-uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'case-uploads' AND ((select auth.uid())::text = (storage.foldername(name))[1])
);

DROP POLICY IF EXISTS "Users can delete own case-uploads" ON storage.objects;
CREATE POLICY "Users can delete own case-uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'case-uploads' AND ((select auth.uid())::text = (storage.foldername(name))[1])
);

-- 8. Hybrid RAG Search Function (Vector + Keyword Ranking)
CREATE OR REPLACE FUNCTION public.search_medical_evidence(
  query_text text,
  query_embedding extensions.vector(1536) DEFAULT null,
  match_count int DEFAULT 5,
  disease_filter text DEFAULT null,
  specialty_filter text DEFAULT null,
  urgency_filter text DEFAULT null,
  condition_filter text DEFAULT null,
  sources_filter text[] DEFAULT null
)
RETURNS TABLE (
  id text,
  title text,
  snippet text,
  source text,
  reference text,
  confidence numeric,
  metadata jsonb,
  similarity double precision,
  keyword_score double precision,
  vector_score double precision
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id::text,
    m.title,
    COALESCE(m.snippet, m.content, '') AS snippet,
    m.source,
    COALESCE(m.reference, m.source_url, '') AS reference,
    m.confidence,
    m.metadata,
    CASE 
      WHEN query_embedding IS NOT NULL AND m.embedding IS NOT NULL THEN
        (1 - (m.embedding <=> query_embedding))::double precision
      ELSE 0.5::double precision
    END AS similarity,
    CASE
      WHEN query_text IS NOT NULL AND (
        m.title ILIKE '%' || query_text || '%' OR
        COALESCE(m.snippet, m.content, '') ILIKE '%' || query_text || '%' OR
        m.metadata::text ILIKE '%' || query_text || '%'
      ) THEN 0.95::double precision
      ELSE 0.3::double precision
    END AS keyword_score,
    CASE 
      WHEN query_embedding IS NOT NULL AND m.embedding IS NOT NULL THEN
        (1 - (m.embedding <=> query_embedding))::double precision
      ELSE NULL::double precision
    END AS vector_score
  FROM public.medical_evidence m
  WHERE
    (disease_filter IS NULL OR m.disease ILIKE '%' || disease_filter || '%' OR m.metadata->>'disease' ILIKE '%' || disease_filter || '%')
    AND (specialty_filter IS NULL OR m.specialty ILIKE '%' || specialty_filter || '%' OR m.metadata->>'specialty' ILIKE '%' || specialty_filter || '%')
    AND (urgency_filter IS NULL OR m.urgency ILIKE '%' || urgency_filter || '%' OR m.metadata->>'urgency' ILIKE '%' || urgency_filter || '%')
    AND (condition_filter IS NULL OR m.condition ILIKE '%' || condition_filter || '%' OR m.metadata->>'condition' ILIKE '%' || condition_filter || '%')
    AND (sources_filter IS NULL OR m.source = ANY(sources_filter))
  ORDER BY
    CASE 
      WHEN query_embedding IS NOT NULL AND m.embedding IS NOT NULL THEN
        m.embedding <=> query_embedding
      ELSE 0
    END ASC,
    CASE
      WHEN query_text IS NOT NULL AND (
        m.title ILIKE '%' || query_text || '%' OR
        COALESCE(m.snippet, m.content, '') ILIKE '%' || query_text || '%' OR
        m.metadata::text ILIKE '%' || query_text || '%'
      ) THEN 1
      ELSE 0
    END DESC,
    m.confidence DESC
  LIMIT match_count;
END;
$$;
