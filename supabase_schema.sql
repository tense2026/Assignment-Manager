-- ============================================================
-- Supabase SQL Schema: 수행평가 매니저 (Assignment Manager)
-- Supabase 대시보드 -> SQL Editor에 복사하여 [Run] 버튼을 누르세요.
-- ============================================================

-- 1. assessments 테이블 생성
CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    subject_color TEXT,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_presentation BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'not_started',
    priority TEXT DEFAULT 'medium',
    requirements TEXT,
    criteria JSONB DEFAULT '[]'::jsonb,
    checklist JSONB DEFAULT '[]'::jsonb,
    reminders JSONB DEFAULT '{}'::jsonb,
    attached_image TEXT,
    score NUMERIC,
    feedback TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 3. 로그인 없이 누구나 읽기/쓰기 가능하도록 Public 정책 부여 (로그인 기능 불필요)
CREATE POLICY "Allow public full access to assessments"
ON public.assessments
FOR ALL
USING (true)
WITH CHECK (true);
