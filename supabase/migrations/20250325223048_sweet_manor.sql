/*
  # Add Initial Carousel Items

  1. New Data
    - Added initial carousel items for the homepage
    - Each item has title, description, image and proper ordering
    
  2. Content
    - Professional medical images
    - Engaging headlines
    - Clear descriptions
*/

INSERT INTO carousel_items (
  title,
  description,
  image_url,
  display_order,
  active
) VALUES 
(
  'Cuidando da Sua Saúde',
  'Encontre os melhores profissionais de saúde para cuidar de você e sua família',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000',
  1,
  true
),
(
  'Especialistas Qualificados',
  'Uma rede completa de médicos e especialistas à sua disposição',
  'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000',
  2,
  true
),
(
  'Tecnologia e Saúde',
  'Utilizando o que há de mais moderno para seu atendimento',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000',
  3,
  true
);