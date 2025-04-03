/*
  # Add Test Specialists Data

  1. New Tables
    - specialists: Stores specialist information
    - specialist_exams: Stores exam information
    
  2. Test Data
    - 5 test specialists with different specialties
    - Multiple exams for each specialist
    
  3. Security
    - RLS enabled on all tables
    - Public read access
    - Admin write access
*/

-- Create specialists table
CREATE TABLE IF NOT EXISTS specialists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  city text NOT NULL,
  consultation_type text NOT NULL CHECK (consultation_type IN ('presencial', 'domiciliar', 'ambos')),
  teleconsultation boolean NOT NULL DEFAULT false,
  image_url text,
  rating numeric(3,1),
  review_count integer DEFAULT 0,
  address text,
  phone text,
  email text,
  bio text,
  availability text[],
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exams table
CREATE TABLE IF NOT EXISTS specialist_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialist_id uuid REFERENCES specialists(id) ON DELETE CASCADE,
  price text,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create triggers for updated_at
CREATE TRIGGER update_specialists_updated_at
  BEFORE UPDATE ON specialists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialist_exams_updated_at
  BEFORE UPDATE ON specialist_exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_exams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view active specialists"
  ON specialists
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage specialists"
  ON specialists
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

CREATE POLICY "Public can view active exams"
  ON specialist_exams
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can manage exams"
  ON specialist_exams
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Insert test specialists
INSERT INTO specialists (
  name,
  specialty,
  city,
  consultation_type,
  teleconsultation,
  image_url,
  rating,
  review_count,
  address,
  phone,
  email,
  bio,
  availability
) VALUES 
(
  'Dr. João Silva',
  'Cardiologia',
  'Brasília - DF',
  'presencial',
  true,
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
  4.9,
  127,
  'Setor Médico Hospitalar Sul, Quadra 102, Bloco A, Sala 301',
  '(61) 3333-1111',
  'dr.joaosilva@exemplo.com',
  'Cardiologista com mais de 15 anos de experiência, especializado em cardiologia intervencionista.',
  ARRAY['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 12h']
),
(
  'Dra. Maria Souza',
  'Dermatologia',
  'Taguatinga - DF',
  'presencial',
  false,
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  4.8,
  98,
  'Avenida Central, Bloco 3, Sala 405, Taguatinga Centro',
  '(61) 3333-2222',
  'dra.mariasouza@exemplo.com',
  'Dermatologista especializada em tratamentos estéticos e dermatologia clínica.',
  ARRAY['Segunda a Sexta: 9h às 17h']
),
(
  'Dr. Lucas Oliveira',
  'Fisioterapia',
  'Águas Claras - DF',
  'presencial',
  true,
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
  5.0,
  156,
  'Rua das Paineiras, Edifício Medical Center, Sala 210, Águas Claras',
  '(61) 3333-3333',
  'dr.lucasoliveira@exemplo.com',
  'Fisioterapeuta especializado em reabilitação ortopédica e esportiva.',
  ARRAY['Segunda a Sexta: 7h às 19h', 'Sábado: 8h às 12h']
),
(
  'Dra. Ana Costa',
  'Ginecologia',
  'Ceilândia - DF',
  'presencial',
  false,
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
  4.7,
  89,
  'Avenida Principal, Centro Médico, Sala 105, Ceilândia Sul',
  '(61) 3333-4444',
  'dra.anacosta@exemplo.com',
  'Ginecologista e obstetra com foco em saúde da mulher e acompanhamento pré-natal.',
  ARRAY['Segunda, Quarta e Sexta: 8h às 18h']
),
(
  'Dr. Felipe Pereira',
  'Médico Domiciliar',
  'Plano Piloto - DF',
  'domiciliar',
  false,
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
  4.8,
  112,
  NULL,
  '(61) 3333-5555',
  'dr.felipepereira@exemplo.com',
  'Médico especializado em atendimento domiciliar para pacientes com mobilidade reduzida.',
  ARRAY['Segunda a Domingo: 8h às 20h (mediante agendamento)']
);

-- Insert test exams
INSERT INTO specialist_exams (
  name,
  specialist_id,
  price,
  description
) VALUES 
(
  'Eletrocardiograma',
  (SELECT id FROM specialists WHERE name = 'Dr. João Silva'),
  'R$ 150,00',
  'Exame que registra a atividade elétrica do coração.'
),
(
  'Teste de Esforço',
  (SELECT id FROM specialists WHERE name = 'Dr. João Silva'),
  'R$ 250,00',
  'Avaliação da função cardíaca durante atividade física.'
),
(
  'Holter',
  (SELECT id FROM specialists WHERE name = 'Dr. João Silva'),
  'R$ 200,00',
  'Monitoramento cardíaco por 24 horas.'
),
(
  'Biópsia Dermatológica',
  (SELECT id FROM specialists WHERE name = 'Dra. Maria Souza'),
  'R$ 300,00',
  'Remoção de pequena amostra de pele para análise laboratorial.'
),
(
  'Dermatoscopia',
  (SELECT id FROM specialists WHERE name = 'Dra. Maria Souza'),
  'R$ 180,00',
  'Exame para avaliação detalhada de lesões de pele.'
),
(
  'Avaliação Fisioterapêutica',
  (SELECT id FROM specialists WHERE name = 'Dr. Lucas Oliveira'),
  'R$ 180,00',
  'Avaliação completa para diagnóstico fisioterapêutico.'
),
(
  'Análise Postural',
  (SELECT id FROM specialists WHERE name = 'Dr. Lucas Oliveira'),
  'R$ 150,00',
  'Avaliação da postura corporal para identificação de problemas.'
),
(
  'Papanicolau',
  (SELECT id FROM specialists WHERE name = 'Dra. Ana Costa'),
  'R$ 120,00',
  'Exame preventivo para detecção de alterações no colo do útero.'
),
(
  'Colposcopia',
  (SELECT id FROM specialists WHERE name = 'Dra. Ana Costa'),
  'R$ 250,00',
  'Exame para visualização detalhada do colo do útero.'
),
(
  'Ultrassonografia Pélvica',
  (SELECT id FROM specialists WHERE name = 'Dra. Ana Costa'),
  'R$ 280,00',
  'Exame de imagem para avaliação dos órgãos pélvicos.'
),
(
  'Avaliação Domiciliar',
  (SELECT id FROM specialists WHERE name = 'Dr. Felipe Pereira'),
  'R$ 350,00',
  'Avaliação médica completa realizada na residência do paciente.'
),
(
  'Acompanhamento Médico',
  (SELECT id FROM specialists WHERE name = 'Dr. Felipe Pereira'),
  'R$ 300,00',
  'Acompanhamento médico periódico em domicílio.'
);