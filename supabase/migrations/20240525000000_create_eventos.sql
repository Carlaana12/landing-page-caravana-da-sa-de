-- Create eventos table
CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_evento DATE NOT NULL,
  hora_evento TIME,
  local TEXT NOT NULL,
  endereco TEXT NOT NULL,
  organizador TEXT,
  contato TEXT,
  imagem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Set up RLS (Row Level Security)
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow all users to read eventos
CREATE POLICY "Allow all users to read eventos"
  ON public.eventos
  FOR SELECT
  USING (true);

-- Only allow authenticated users to insert eventos
CREATE POLICY "Allow authenticated users to insert eventos"
  ON public.eventos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only allow authenticated users to update their own eventos
CREATE POLICY "Allow authenticated users to update their own eventos"
  ON public.eventos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only allow authenticated users to delete their own eventos
CREATE POLICY "Allow authenticated users to delete their own eventos"
  ON public.eventos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add eventos to public schema
GRANT ALL ON public.eventos TO authenticated;
GRANT SELECT ON public.eventos TO anon;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp on update
CREATE TRIGGER update_eventos_updated_at
BEFORE UPDATE ON public.eventos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column(); 