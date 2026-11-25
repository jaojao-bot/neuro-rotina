-- Tabela de Cuidadores (Caregivers / Responsáveis)
CREATE TABLE IF NOT EXISTS public.caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'Mãe/Pai/Tutor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e permissão pública para cadastro e consulta
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público caregivers" ON public.caregivers FOR ALL USING (true) WITH CHECK (true);
