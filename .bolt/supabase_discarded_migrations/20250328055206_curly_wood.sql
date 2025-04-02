/*
  # Add Initial Highlights

  1. Changes
    - Add default highlights for homepage
    - Set proper icons and colors
    - Add meaningful descriptions
    
  2. Content
    - Professional highlights
    - Clear descriptions
    - Engaging content
*/

INSERT INTO highlights (
  title,
  description,
  icon,
  color,
  display_order,
  active
) VALUES 
(
  'Profissionais Qualificados',
  'Nossa rede conta com os melhores profissionais de saúde, todos devidamente certificados e com vasta experiência.',
  'UserCheck',
  '#408040',
  1,
  true
),
(
  'Atendimento Humanizado',
  'Priorizamos um atendimento acolhedor e personalizado, focado nas necessidades individuais de cada paciente.',
  'Heart',
  '#408040',
  2,
  true
),
(
  'Tecnologia Avançada',
  'Utilizamos equipamentos e sistemas de última geração para garantir diagnósticos precisos e tratamentos eficazes.',
  'Cpu',
  '#408040',
  3,
  true
),
(
  'Ampla Cobertura',
  'Oferecemos uma extensa rede de especialidades médicas para cuidar da sua saúde de forma completa.',
  'Shield',
  '#408040',
  4,
  true
);