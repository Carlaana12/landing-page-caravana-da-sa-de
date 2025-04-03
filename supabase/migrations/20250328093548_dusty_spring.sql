/*
  # Add Medical Specialties Highlights to Home Page

  1. Changes
    - Add medical specialties highlights for home page
    - Set proper icons and descriptions
    - Maintain consistent styling
    
  2. Content
    - Professional medical specialties
    - Clear descriptions
    - Proper ordering
*/

-- Insert medical specialties for home page
INSERT INTO highlights (
  title,
  description,
  icon,
  color,
  display_order,
  active,
  category,
  type
) VALUES 
(
  'Cardiologia',
  'Tratamento especializado de doenças cardíacas',
  'Heart',
  '#408040',
  0,
  true,
  'home',
  'specialty'
),
(
  'Neurologia',
  'Cuidados com o sistema nervoso',
  'Brain',
  '#408040',
  1,
  true,
  'home',
  'specialty'
),
(
  'Oftalmologia',
  'Saúde dos seus olhos',
  'Eye',
  '#408040',
  2,
  true,
  'home',
  'specialty'
),
(
  'Clínica Geral',
  'Atendimento médico completo',
  'Stethoscope',
  '#408040',
  3,
  true,
  'home',
  'specialty'
),
(
  'Pediatria',
  'Cuidado especial com as crianças',
  'Baby',
  '#408040',
  4,
  true,
  'home',
  'specialty'
),
(
  'Ortopedia',
  'Tratamento do sistema musculoesquelético',
  'Bone',
  '#408040',
  5,
  true,
  'home',
  'specialty'
),
(
  'Pneumologia',
  'Tratamento de doenças respiratórias',
  'Lungs',
  '#408040',
  6,
  true,
  'home',
  'specialty'
),
(
  'Endocrinologia',
  'Tratamento de distúrbios hormonais',
  'Pill',
  '#408040',
  7,
  true,
  'home',
  'specialty'
),
(
  'Dermatologia',
  'Cuidados com a saúde da pele',
  'Star',
  '#408040',
  8,
  true,
  'home',
  'specialty'
)
ON CONFLICT (title, category, type) DO UPDATE 
SET 
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order,
  active = EXCLUDED.active;