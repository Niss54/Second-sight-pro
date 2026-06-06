-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create the medical_evidence table
create table if not exists medical_evidence (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  snippet text not null,
  source text not null,
  reference text,
  confidence numeric,
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536) -- OpenAI text-embedding-3-small dimensionality
);

-- 3. Create a Postgres function for cosine similarity search
create or replace function search_medical_evidence(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  snippet text,
  source text,
  reference text,
  confidence numeric,
  metadata jsonb,
  similarity float
)
language sql
stable
as $$
  select
    medical_evidence.id,
    medical_evidence.title,
    medical_evidence.snippet,
    medical_evidence.source,
    medical_evidence.reference,
    medical_evidence.confidence,
    medical_evidence.metadata,
    1 - (medical_evidence.embedding <=> query_embedding) as similarity
  from medical_evidence
  where 1 - (medical_evidence.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
