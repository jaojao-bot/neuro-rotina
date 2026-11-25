-- Schema SQL para o Neuro-Rotina no Supabase
-- Copie e execute este script no "SQL Editor" do painel do Supabase:
-- https://supabase.com/dashboard/project/igqykgtfmxuzrvoxjqfb/sql/new

-- 1. Tabela de Crianças (Children)
CREATE TABLE IF NOT EXISTS public.children (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    diagnosis TEXT,
    avatar TEXT DEFAULT '🦁',
    stars INTEGER DEFAULT 0,
    "streakDays" INTEGER DEFAULT 0,
    "colorScheme" TEXT DEFAULT 'calm-blue',
    sensitivities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Tarefas da Rotina (Tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    "childId" TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    time TEXT,
    "durationMin" INTEGER DEFAULT 5,
    stars INTEGER DEFAULT 5,
    icon TEXT DEFAULT 'Sparkles',
    category TEXT DEFAULT 'Geral',
    status TEXT DEFAULT 'todo',
    "sensoryLevel" TEXT DEFAULT 'baixo',
    "sensoryTip" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Recompensas (Rewards)
CREATE TABLE IF NOT EXISTS public.rewards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    cost INTEGER DEFAULT 10,
    icon TEXT DEFAULT 'Gift',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Registro Emocional (Emotion Logs)
CREATE TABLE IF NOT EXISTS public.emotion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "childId" TEXT REFERENCES public.children(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    emotion TEXT NOT NULL,
    label TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) permitindo leitura e escrita anônima inicial (para o app funcionar perfeitamente com anon key)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público children" ON public.children FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público rewards" ON public.rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público emotion_logs" ON public.emotion_logs FOR ALL USING (true) WITH CHECK (true);
