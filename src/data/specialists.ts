import { Specialist, Exam } from '../lib/types';

// Test specialists data
export const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    city: 'Brasília - DF',
    consultationType: 'presencial',
    teleconsultation: true,
    exams: ['Eletrocardiograma', 'Teste de Esforço', 'Holter'],
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    rating: 4.9,
    reviewCount: 127,
    address: 'Setor Médico Hospitalar Sul, Quadra 102, Bloco A, Sala 301',
    phone: '(61) 3333-1111',
    email: 'dr.joaosilva@exemplo.com',
    bio: 'Cardiologista com mais de 15 anos de experiência, especializado em cardiologia intervencionista. Formado pela Universidade de São Paulo (USP) com residência no Instituto do Coração (InCor). Atuo no diagnóstico e tratamento de doenças cardiovasculares, com foco em prevenção e qualidade de vida.',
    availability: ['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 12h'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    insurance: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
    experience: '15 anos'
  },
  {
    id: '2',
    name: 'Dra. Maria Souza',
    specialty: 'Dermatologia',
    city: 'Taguatinga - DF',
    consultationType: 'presencial',
    teleconsultation: false,
    exams: ['Biópsia Dermatológica', 'Dermatoscopia'],
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    reviewCount: 98,
    address: 'Avenida Central, Bloco 3, Sala 405, Taguatinga Centro',
    phone: '(61) 3333-2222',
    email: 'dra.mariasouza@exemplo.com',
    bio: 'Dermatologista especializada em tratamentos estéticos e dermatologia clínica. Formada pela Universidade Federal do Rio de Janeiro (UFRJ) com especialização em Dermatologia pela Sociedade Brasileira de Dermatologia. Atendo pacientes de todas as idades, com foco em saúde da pele e procedimentos estéticos minimamente invasivos.',
    availability: ['Segunda a Sexta: 9h às 17h'],
    languages: ['Português', 'Francês'],
    insurance: ['Unimed', 'SulAmérica', 'NotreDame'],
    experience: '12 anos'
  },
  {
    id: '3',
    name: 'Dr. Lucas Oliveira',
    specialty: 'Fisioterapia',
    city: 'Águas Claras - DF',
    consultationType: 'presencial',
    teleconsultation: true,
    exams: ['Avaliação Fisioterapêutica', 'Análise Postural'],
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    rating: 5.0,
    reviewCount: 156,
    address: 'Rua das Paineiras, Edifício Medical Center, Sala 210, Águas Claras',
    phone: '(61) 3333-3333',
    email: 'dr.lucasoliveira@exemplo.com',
    bio: 'Fisioterapeuta especializado em reabilitação ortopédica e esportiva. Formado pela Universidade de Brasília (UnB) com especialização em Fisioterapia Esportiva. Trabalho com atletas profissionais e amadores, além de pacientes com lesões ortopédicas, utilizando técnicas modernas de reabilitação e prevenção de lesões.',
    availability: ['Segunda a Sexta: 7h às 19h', 'Sábado: 8h às 12h'],
    languages: ['Português', 'Inglês'],
    insurance: ['Unimed', 'Bradesco Saúde'],
    experience: '10 anos'
  },
  {
    id: '4',
    name: 'Dra. Ana Costa',
    specialty: 'Ginecologia',
    city: 'Ceilândia - DF',
    consultationType: 'presencial',
    teleconsultation: false,
    exams: ['Papanicolau', 'Colposcopia', 'Ultrassonografia Pélvica'],
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
    rating: 4.7,
    reviewCount: 89,
    address: 'Avenida Principal, Centro Médico, Sala 105, Ceilândia Sul',
    phone: '(61) 3333-4444',
    email: 'dra.anacosta@exemplo.com',
    bio: 'Ginecologista e obstetra com foco em saúde da mulher e acompanhamento pré-natal. Formada pela Universidade Federal de Minas Gerais (UFMG) com residência em Ginecologia e Obstetrícia. Atendo mulheres em todas as fases da vida, desde a adolescência até a menopausa, com abordagem humanizada e acolhedora.',
    availability: ['Segunda, Quarta e Sexta: 8h às 18h'],
    languages: ['Português', 'Espanhol'],
    insurance: ['SulAmérica', 'Amil', 'NotreDame'],
    experience: '14 anos'
  },
  {
    id: '5',
    name: 'Dr. Felipe Pereira',
    specialty: 'Médico Domiciliar',
    city: 'Plano Piloto - DF',
    consultationType: 'domiciliar',
    teleconsultation: false,
    exams: ['Avaliação Domiciliar', 'Acompanhamento Médico'],
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    reviewCount: 112,
    address: null,
    phone: '(61) 3333-5555',
    email: 'dr.felipepereira@exemplo.com',
    bio: 'Médico especializado em atendimento domiciliar para pacientes com mobilidade reduzida. Formado pela Universidade de Brasília (UnB) com especialização em Geriatria. Ofereço atendimento humanizado e personalizado, levando cuidados médicos de qualidade até a residência do paciente, com foco em idosos e pessoas com dificuldades de locomoção.',
    availability: ['Segunda a Domingo: 8h às 20h (mediante agendamento)'],
    languages: ['Português', 'Inglês'],
    insurance: ['Unimed', 'Bradesco Saúde', 'Porto Seguro'],
    experience: '16 anos'
  },
  {
    id: '6',
    name: 'Dra. Carla Mendes',
    specialty: 'Dermatologia',
    city: 'Brasília - DF',
    consultationType: 'presencial',
    teleconsultation: true,
    exams: ['Biópsia de Pele', 'Peeling Químico', 'Tratamentos a Laser'],
    imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300',
    rating: 4.9,
    reviewCount: 134,
    address: 'Asa Sul, Quadra 516, Bloco B, Sala 25',
    phone: '(61) 3333-6666',
    email: 'dra.carlamendes@exemplo.com',
    bio: 'Dermatologista com especialização em dermatologia clínica e estética. Formada pela Universidade Federal do Rio Grande do Sul (UFRGS) com pós-graduação em Dermatologia Estética. Trabalho com tratamentos para acne, melasma, rejuvenescimento facial e procedimentos minimamente invasivos, sempre buscando resultados naturais e harmônicos.',
    availability: ['Terça e Quinta: 8h às 18h', 'Sábado: 8h às 12h'],
    languages: ['Português', 'Inglês', 'Italiano'],
    insurance: ['Unimed', 'Bradesco Saúde', 'SulAmérica'],
    experience: '14 anos'
  },
  {
    id: '7',
    name: 'Dr. Ricardo Almeida',
    specialty: 'Ortopedia',
    city: 'Brasília - DF',
    consultationType: 'presencial',
    teleconsultation: true,
    exams: ['Raio-X', 'Ressonância Magnética', 'Ultrassonografia Musculoesquelética'],
    imageUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300',
    rating: 4.7,
    reviewCount: 105,
    address: 'Asa Norte, Quadra 716, Bloco C, Sala 305',
    phone: '(61) 3333-7777',
    email: 'dr.ricardoalmeida@exemplo.com',
    bio: 'Ortopedista especializado em traumatologia esportiva e cirurgia do joelho. Formado pela Universidade de São Paulo (USP) com fellowship em Cirurgia do Joelho. Atendo atletas profissionais e amadores, além de pacientes com problemas ortopédicos gerais, utilizando técnicas minimamente invasivas sempre que possível.',
    availability: ['Segunda, Quarta e Sexta: 8h às 18h'],
    languages: ['Português', 'Inglês', 'Espanhol'],
    insurance: ['Unimed', 'Bradesco Saúde', 'Amil'],
    experience: '18 anos'
  }
];

// Test exams data
export const exams: Exam[] = [
  {
    id: '1',
    name: 'Eletrocardiograma',
    specialistId: '1',
    specialistName: 'Dr. João Silva',
    specialty: 'Cardiologia',
    location: 'Brasília - DF',
    price: 'R$ 150,00',
    description: 'Exame que registra a atividade elétrica do coração.'
  },
  {
    id: '2',
    name: 'Teste de Esforço',
    specialistId: '1',
    specialistName: 'Dr. João Silva',
    specialty: 'Cardiologia',
    location: 'Brasília - DF',
    price: 'R$ 250,00',
    description: 'Avaliação da função cardíaca durante atividade física.'
  },
  {
    id: '3',
    name: 'Biópsia Dermatológica',
    specialistId: '2',
    specialistName: 'Dra. Maria Souza',
    specialty: 'Dermatologia',
    location: 'Taguatinga - DF',
    price: 'R$ 300,00',
    description: 'Remoção de pequena amostra de pele para análise laboratorial.'
  },
  {
    id: '4',
    name: 'Avaliação Fisioterapêutica',
    specialistId: '3',
    specialistName: 'Dr. Lucas Oliveira',
    specialty: 'Fisioterapia',
    location: 'Águas Claras - DF',
    price: 'R$ 180,00',
    description: 'Avaliação completa para diagnóstico fisioterapêutico.'
  },
  {
    id: '5',
    name: 'Papanicolau',
    specialistId: '4',
    specialistName: 'Dra. Ana Costa',
    specialty: 'Ginecologia',
    location: 'Ceilândia - DF',
    price: 'R$ 120,00',
    description: 'Exame preventivo para detecção de alterações no colo do útero.'
  },
  {
    id: '6',
    name: 'Avaliação Domiciliar',
    specialistId: '5',
    specialistName: 'Dr. Felipe Pereira',
    specialty: 'Médico Domiciliar',
    location: 'Plano Piloto - DF',
    price: 'R$ 350,00',
    description: 'Avaliação médica completa realizada na residência do paciente.'
  }
];

// Utility functions to filter specialists
export const filterSpecialists = (
  category: string | null,
  filters: Record<string, string[]>,
  searchTerm: string = ''
): Specialist[] => {
  if (!category) return [];

  let filtered = [...specialists];

  // Apply category filter
  switch (category) {
    case 'consultations':
      filtered = filtered.filter(s => s.consultationType === 'presencial' || s.consultationType === 'ambos');
      break;
    case 'teleconsultations':
      filtered = filtered.filter(s => s.teleconsultation);
      break;
    case 'physiotherapy':
      filtered = filtered.filter(s => s.specialty === 'Fisioterapia');
      break;
    case 'home-doctor':
      filtered = filtered.filter(s => s.consultationType === 'domiciliar');
      break;
    // Add other category filters as needed
  }

  // Apply specific filters
  Object.entries(filters).forEach(([filterId, values]) => {
    if (values.length === 0) return;

    switch (filterId) {
      case 'specialty':
        filtered = filtered.filter(s => values.includes(s.specialty));
        break;
      case 'city':
        filtered = filtered.filter(s => values.includes(s.city));
        break;
      case 'specialist':
        filtered = filtered.filter(s => values.includes(s.name));
        break;
      // Add other filter types as needed
    }
  });

  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      s => s.name.toLowerCase().includes(term) || 
           s.specialty.toLowerCase().includes(term) ||
           s.city.toLowerCase().includes(term)
    );
  }

  return filtered;
};

// Utility function to filter exams
export const filterExams = (
  filters: Record<string, string[]>,
  searchTerm: string = ''
): Exam[] => {
  let filtered = [...exams];

  // Apply specific filters
  Object.entries(filters).forEach(([filterId, values]) => {
    if (values.length === 0) return;

    switch (filterId) {
      case 'specialty':
        filtered = filtered.filter(e => values.includes(e.specialty));
        break;
      case 'clinic':
        filtered = filtered.filter(e => values.includes(e.location));
        break;
      case 'specialist':
        filtered = filtered.filter(e => values.includes(e.specialistName));
        break;
      // Add other filter types as needed
    }
  });

  // Apply search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      e => e.name.toLowerCase().includes(term) || 
           e.specialistName.toLowerCase().includes(term) ||
           e.specialty.toLowerCase().includes(term) ||
           e.location.toLowerCase().includes(term)
    );
  }

  return filtered;
};

// Get all available specialties
export const getAllSpecialties = (): string[] => {
  const specialties = new Set<string>();
  specialists.forEach(s => specialties.add(s.specialty));
  return Array.from(specialties).sort();
};

// Get all available cities
export const getAllCities = (): string[] => {
  const cities = new Set<string>();
  specialists.forEach(s => cities.add(s.city));
  return Array.from(cities).sort();
};

// Get all available specialists
export const getAllSpecialists = (): string[] => {
  return specialists.map(s => s.name).sort();
};

// Get all available exams
export const getAllExams = (): string[] => {
  const examNames = new Set<string>();
  exams.forEach(e => examNames.add(e.name));
  return Array.from(examNames).sort();
};

// Get specialist by slug
export const getSpecialistBySlug = (slug: string): Specialist | undefined => {
  // Log para debug
  console.log("Buscando médico com slug:", slug);
  console.log("Médicos disponíveis:", specialists.map(s => ({
    name: s.name,
    slug: s.name.toLowerCase().replace(/\s+/g, '-')
  })));
  
  const specialist = specialists.find(
    (specialist) => {
      const specialistSlug = specialist.name.toLowerCase().replace(/\s+/g, '-');
      console.log(`Comparando: "${specialistSlug}" com "${slug}"`);
      return specialistSlug === slug;
    }
  );
  
  console.log("Médico encontrado:", specialist);
  return specialist;
};

// Get related specialists (same specialty)
export const getRelatedSpecialists = (specialty: string, currentId: string): Specialist[] => {
  return specialists.filter(
    (specialist) => specialist.specialty === specialty && specialist.id !== currentId
  ).slice(0, 3);
};