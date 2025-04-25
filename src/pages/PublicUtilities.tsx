import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MapPin, Clock, AlertCircle, Stethoscope, Pill, Ambulance, Guitar as Hospital, X, Building as HospitalIcon, Leaf, Activity as Health } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const emergencyContacts = [
  { icon: Phone, label: 'SAMU', number: '192' },
  { icon: Phone, label: 'Bombeiros', number: '193' },
  { icon: Phone, label: 'Polícia', number: '190' },
  { icon: Phone, label: 'Defesa Civil', number: '199' },
];

const hospitals = [
  {
    name: 'Hospital São Lucas',
    address: 'Av. Principal, 1000',
    phone: '(11) 1234-5678',
    type: 'Geral',
    coordinates: [-23.5505, -46.6333]
  },
  {
    name: 'Hospital Santa Maria',
    address: 'Rua Secundária, 500',
    phone: '(11) 8765-4321',
    type: 'Especializado',
    coordinates: [-23.5605, -46.6433]
  },
  // Add more hospitals...
];

const pharmacies = [
  {
    name: 'Farmácia 24h',
    address: 'Av. Comercial, 200',
    phone: '(11) 2345-6789',
    hours: '24 horas',
    coordinates: [-23.5525, -46.6353]
  },
  // Add more pharmacies...
];

// --- INÍCIO: Novos dados e interface ---
interface HospitalPharmacy {
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  observations?: string | null;
  city: string;
}

const hospitalPharmaciesData: HospitalPharmacy[] = [
  // Brasília - DF
  { name: 'Super Saúde - Produtos Hospitalares', address: 'SHLS Conj. L BLOCO 02 LOJA C1 1SS - Asa Sul, Brasília - DF, 70390-700', email: null, phone: '(61) 3449-4328', city: 'Brasília - DF' },
  { name: 'BRANDEMED IMPORTAÇÃO E EXPORTAÇÃO DE PRODUTOS HOSPITALARES LTDA', address: 'QS 1 Q SALA 1002 - AREAL, Brasília - DF, 71950-550', email: null, phone: '(61) 3048-3175', city: 'Brasília - DF' },
  { name: 'AXON HEALTHCARE BRASIL COMÉRCIO DE PRODUTOS HOSPITALARES LTDA', address: 'SMAS Conjunto 3, Trecho 3 Torre E, Brasília - DF, 71215-300', email: null, phone: '(61) 2194-8524', city: 'Brasília - DF' },
  { name: 'EASY CIENTÍFICA COMÉRCIO DE PRODUTOS HOSPITALARES LTDA', address: 'Vila Nova Divinéia Lote 08 Loja 01 - Núcleo Bandeirante, Brasília - DF, 71710-560', email: null, phone: '(61) 3264-0714', city: 'Brasília - DF' },
  { name: 'ORTOMED COMÉRCIO DE PRODUTOS HOSPITALARES MÉDICOS ODONTOLÓGICOS E PRODUTOS ORTOPÉDICOS LTDA', address: 'Rua 5 Norte, Lote 3, Loja 22 Albany Medical Center - Águas Claras, Brasília - DF, 71907-720', email: null, phone: '(61) 99820-7685', city: 'Brasília - DF' },
  { name: 'SANTÉ PRODUTOS HOSPITALARES LTDA', address: 'Avenida Contorno Ae 13 Lt I1 - s/n lj 1 - Núcleo Bandeirante, DF', email: null, phone: '(61) 3386-0707', city: 'Brasília - DF' },
  { name: 'ARTWARE PRODUTOS E SERVIÇOS LTDA', address: 'Asa Norte Comércio Local Norte 411 BL C Loja 44 SS - Asa Norte, Brasília - DF, 70866-530', email: null, phone: '(61) 99414-2100', city: 'Brasília - DF' },
  { name: 'IMED REPRESENTAÇÃO COMERCIAL DE PRODUTOS HOSPITALARES LTDA', address: 'Asa Norte Comércio Local Norte 411 BL C Loja 44 SS - Asa Norte, Brasília - DF, 70866-530', email: null, phone: '(61) 99414-2100', city: 'Brasília - DF' },
  { name: 'UNIÃO MÉDICA COMÉRCIO DE PRODUTOS HOSPITALARES LTDA', address: 'St. de Habitações Individuais Norte CA 3 - Lago Norte, Brasília - DF, 73503-503', email: null, phone: '4000-2090', city: 'Brasília - DF' },
  { name: 'AVANT MEDICAL COMÉRCIO DE PRODUTOS HOSPITALARES LTDA', address: 'Trecho Sia Trecho 3 - Zona Industrial (Guara) Brasilia - DF, 71.200-033', email: null, phone: '(61) 3686-5882', city: 'Brasília - DF' },
  { name: 'MI COMÉRCIO DE PRODUTOS HOSPITALARES E EQUIPAMENTOS LTDA', address: 'Saa Q 3 - Brasília, DF, 70632-300', email: null, phone: '(61) 3048-7650', city: 'Brasília - DF' },
  // São Paulo - SP
  { name: 'Cirúrgica Salutar', address: 'R. Augusto Tolle, 730 - Santana, São Paulo - SP, 02405-001', email: null, phone: '(11) 99171-3841', city: 'São Paulo - SP' },
  { name: 'hospitalar multimarcas', address: null, email: null, phone: '(51) 99701-1114', city: 'São Paulo - SP' }, // Atenção: Telefone parece (51)
  { name: 'Cirúrgica São Paulo Ltda - Matriz', address: 'R. Borges Lagoa, 825 - Vila Clementino, São Paulo - SP, 04038-034', email: null, phone: '(11) 5904-1700', city: 'São Paulo - SP' },
  { name: 'Casa do Médico - Casa Cirúrgica em São Paulo - Loja de Produtos Hospitalares e Médicos', address: 'Alameda Campinas, 1245 - Jardim Paulista, São Paulo - SP, 01404-001', email: null, phone: '(11) 4750-2249', city: 'São Paulo - SP' },
  { name: 'Medicalway', address: 'Santa Felicidade, Curitiba - PR, 82305-100', email: null, phone: '(11) 5051-5225', city: 'São Paulo - SP' }, // Atenção: Endereço PR, Telefone SP
  { name: 'Sinete Cirúrgica - Mooca', address: 'R. Visc. de Laguna, 170 - Mooca, São Paulo - SP, 03112-110', email: null, phone: '(11) 2692-4000', city: 'São Paulo - SP' },
  { name: 'Cirúrgica Tatuapé - Produtos Médicos e Hospitalares', address: 'R. Serra de Bragança, 1355 - Tatuapé, São Paulo - SP, 03318-000', email: null, phone: '(11) 3628-2125', city: 'São Paulo - SP' },
  { name: 'Casa Hospitalar - Produtos Ortopédicos, Hospitalares', address: null, email: null, phone: '(43) 3356-0063', city: 'São Paulo - SP' }, // Atenção: Telefone PR (43)
  // Paraná - PR
  { name: 'Cirúrgica Paraná', address: 'R. Baronesa do Cerro Azul, 728 - Costeira, Paranaguá - PR, 83203-420', email: null, phone: '(41) 3425-4488', city: 'Paraná - PR' },
  { name: 'Medclean Produtos Hospitalares - Ng2 Medica', address: 'Av. Mal. Floriano Peixoto, 7142 - Boqueirão, Curitiba - PR, 81670-000', email: null, phone: '(41) 3082-5114', city: 'Paraná - PR' },
  { name: 'Hospinet - Venda e Assistência Técnica de Produtos Hospitalares', address: 'R. Barão do Rio Branco, 518 - Centro, Curitiba - PR, 80010-180', email: null, phone: '(41) 3232-8877', city: 'Paraná - PR' },
  { name: 'Casa Médica', address: 'R. Sen. Souza Naves, 1550 - Centro, Londrina - PR, 86010-160', email: null, phone: '(43) 3378-8888', city: 'Paraná - PR' },
  { name: 'Cirupar Produtos Hospitalares', address: 'R. Conselheiro Araújo, 379 - Alto da Glória, Curitiba - PR, 80060-150', email: null, phone: '(41) 3264-8551', city: 'Paraná - PR' },
  { name: 'Maximed – Materiais Hospitalares', address: 'R. Delfino Dias do Prado, 513 - Jardim Maria Luiza, Cascavel - PR, 85819-650', email: null, phone: '(45) 3222-8804', city: 'Paraná - PR' },
  { name: 'Cirúrgica Gralha Azul', address: 'R. Souza Naves, 3223 - Centro, Cascavel - PR, 85801-120', email: null, phone: '(45) 3223-4806', city: 'Paraná - PR' },
  { name: 'Hospitel - Produtos Hospitalares', address: 'Rua Desembargador Motta, 2981 - Bigorrilho, Curitiba - PR, 80430-152', email: null, phone: '(41) 3016-3100', city: 'Paraná - PR' },
  { name: 'MEDSTORE', address: 'Av. Carlos Gomes, 571 - Zona 05, Maringá - PR, 87015-200', email: null, phone: '(44) 3031-9014', city: 'Paraná - PR' },
  { name: 'Orto Curitiba', address: 'R. Nunes Machado, 575 - Loja1 - Centro, Curitiba - PR, 80250-000', email: null, phone: '(41) 3311-1723', city: 'Paraná - PR' },
];

// Agrupando por cidade
const groupedPharmacies = hospitalPharmaciesData.reduce((acc, pharmacy) => {
  const city = pharmacy.city || 'Outros';
  if (!acc[city]) {
    acc[city] = [];
  }
  acc[city].push(pharmacy);
  return acc;
}, {} as Record<string, HospitalPharmacy[]>);
// --- FIM: Novos dados e interface ---

// --- INÍCIO: Dados Hospitais Públicos ---
interface PublicHospital {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  observation: string | null;
}

const publicHospitalsData: PublicHospital[] = [
  { name: 'Hospital De Base', address: 'SMHS, Área Especial, Quadra 101, Asa Sul, Brasília – DF', phone: '(61) 3550-8900', email: null, observation: 'Atendimento 24 horas, todos os dias da semana. Ligada diretamente ao Serviço de Atendimento Móvel de Urgência (Samu)' },
  { name: 'Hospital De Apoio', address: 'AENW 03 lote A, Setor Noroeste CEP: 70.684-831 (ao lado do Hospital da Criança)', phone: '(61) 3449-7522/7523', email: null, observation: 'Horários sujeitos a alteração em casos excepcionais de saúde pública.' },
  { name: 'Hospital Materno Infantil DR.', address: 'L2 SUL Quadra 608 Módulo A – Asa Sul – Brasília – DF. CEP: 70.203-900', phone: '(61) 3449-7734/7743', email: null, observation: 'A marcação é feita via Complexo Regulador Ambulatorial da SES-DF e Regulação interna/HMIB. As vagas restantes, em cada especialidade, são disponibilizadas para outras regionais de saúde, que recebem agendas. Os encaminhamentos do próprio hospital são agendados na marcação de consultas da unidade.' },
  { name: 'Hospital da Criança', address: 'SAIN – Setor de Áreas Isoladas Norte, Lote 4B – Asa Norte (ao lado do Hospital de Apoio de Brasília) – DF. CEP: 70.071-900', phone: '(61) 3025-8350', email: null, observation: 'Horário de atendimento: Serviços Ambulatoriais e Administrativos: 7h às 18h. Linhas de ônibus: 143 e 143.2. Acessibilidade: Sim. Estacionamento: Público' },
  { name: 'Hospital Regional da Asa Norte – HRAN', address: 'SMHN QUADRA 101 BLOCO A ÁREA ESPECIAL – BRASÍLIA-DF, CEP: 70.710-905', phone: '(61) 2017-1900', email: null, observation: 'Atendimento de emergência e urgência nas seguintes especialidades: Cirurgia Geral, Clínica Médica, Odontologia, Ginecologia e Obstetrícia, Oftalmologia, Queimados e Cirurgia Plástica' },
  { name: 'Hospital Regional de Brazlandia', address: 'Área Especial 06 – Setor Tradicional – Brazlândia/DF – CEP: 73.740-793', phone: '(61) 3449-6318/6319', email: null, observation: 'O atendimento no Pronto Socorro da Pediatria é feito para crianças de 0 dias até 13 anos, 11 meses e 29 dias. O atendimento de emergência da Odontologia é segunda a sexta feira das 07:00 às 19:00 horas.' },
  { name: 'Hospital Regional de Ceilândia', address: 'QNM 27 Área Especial 1 QNM 28 – Ceilândia, Brasília – DF, 72215-270', phone: '(61) 3449-6027/6028', email: null, observation: 'Acessibilidade: disponível em todos os acessos da unidade de saúde. Possui estacionamento para carros, motos e bicicletas.' },
  { name: 'Hospital Regional do Gama', address: 'Área Especial nº 1 – Setor CENTRAL – DF. CEP: 72.405-901', phone: '(61) 3449-7044/7039', email: 'dhrg@saude.df.gov.br / gabhrg@gmail.com', observation: 'Prioridade de atendimento: pessoas com deficiência, idosos com idade igual ou superior a 60 (sessenta) anos, gestantes, lactantes, pessoas com crianças de colo e os obesos nos termos da lei.' },
  { name: 'Hospital do Guará', address: 'QI 06 Área Especial C - Guará I', phone: '(61) 3449-4943/4944', email: null, observation: 'Troca de acompanhantes: Manhã: das 7h às 9h, Tarde: das 12h às 14h, Noite: das 19h às 21h' },
  { name: 'Hospital Regional Leste (Paranoá)', address: 'Área especial hospitalar, quadra 2, conj. K, lote 1, CEP 71570-050 Paranoá- DF', phone: '(61) 3449-5225/5224', email: null, observation: 'Documento de identidade válido, com fotografia. Menores acompanhados por responsáveis legais' },
  { name: 'Hospital Regional de Planaltina', address: 'Av. WL4 – Área Especial – Setor Hospitalar Planaltina-DF. CEP: 73310- 000', phone: '(61) 3449-5752/5753', email: null, observation: 'Existência de rampas em todas as entradas de acesso da Unidade Hospitalar e corredores internos. Presença de ponto de ônibus em frente ao Hospital.' },
  { name: 'Hospital de Samambaia – HRSAM', address: 'QS 614 CJ C LOTES 1/2. CEP: 72.322-583', phone: '(61) 3449-6810/6811/6812', email: null, observation: 'Atendimento de urgência e emergência.' }, // Obs simplificada
  { name: 'Hospital de Sobradinho', address: 'Q 12 CJ B LT 38 Sobradinho – DF. CEP: 73010-120', phone: '(61) 3449-5542/5543', email: null, observation: 'Serviços: Atendimento de Emergência, Banco de Leite, Banco de Sangue, CAPSI' },
  { name: 'Hospital de Taguatinga', address: 'Setor C Norte, Área Especial 24, Taguatinga Norte-DF', phone: '(61) 3449-6534/6535/6536', email: null, observation: 'Troca de acompanhantes: Manhã: das 7h às 8h, Tarde: das 12h às 13h, Noite: das 19h às 20h' },
];
// --- FIM: Dados Hospitais Públicos ---

// --- INÍCIO: Dados Clínicas Homeopáticas ---
interface HomeopathicClinic {
  name: string;
  phone: string | null;
  address: string | null;
  contactInfo: string | null; // Para E-mail ou Site
  observations?: string | null;
}

interface HomeopathicRegion {
  regionName: string;
  clinics: HomeopathicClinic[] | null; // null se "Não possui"
}

interface HomeopathicResponsible {
  areas: string;
  regions: HomeopathicRegion[];
}

const homeopathicData: HomeopathicResponsible[] = [
  {
    areas: 'Ceilândia, Vicente Pires, Guará, Sobradinho e Paranoá',
    regions: [
      {
        regionName: 'Ceilândia',
        clinics: [
          { name: 'Farmácia Homeopática Seiva', phone: '61 3371-3953', address: 'CNM 1, Bloco. D (Loja Ceilândia Centro), Brasília, DF, 72215-508 1', contactInfo: null, observations: null },
          { name: 'Farmácia de Manipulação Seiva', phone: '61 3373-3341', address: 'CNM 2, bloco. B, loja. 6, Ceilândia, DF, 72210-502', contactInfo: null, observations: null },
        ]
      },
      {
        regionName: 'Vicente Pires',
        clinics: [
          { name: 'Flora Nativa', phone: null, address: 'V Epia 3, km. 24, chácara 71, Brasília, DF, 71725-015', contactInfo: 'www.floranativadobrasil.com.br (site)', observations: null }
        ]
      },
      { regionName: 'Guará', clinics: null },
      {
        regionName: 'Sobradinho',
        clinics: [
          { name: 'Similimun Clinica de Homeopatia e Pediatra', phone: null, address: 'STN 30, casa O (Co 205), Sobradinho, BA, 70310-500', contactInfo: null, observations: null }, // Atenção: BA no endereço?
          { name: 'Vivenda Manipulações e Homeopatia', phone: null, address: 'CL 66, Brasília, DF, 73026-615', contactInfo: null, observations: null },
        ]
      },
      { regionName: 'Paranoá', clinics: null },
    ]
  },
  {
    areas: 'Águas Claras, Núcleo Bandeirantes, Candangolândia, Gama, Riacho Fundo 1 e 2, Taguatinga Sul e Norte',
    regions: [
      {
        regionName: 'Águas Claras',
        clinics: [
          { name: 'Medicae homeopatia', phone: '61 9 8229-5257', address: 'Q. 101 Vista Medical & Business Sala 1407 - Águas Claras, Brasília - DF, 71906-750', contactInfo: 'contato@medicaesaude.com.br', observations: null },
          { name: 'Farma Certa Manipulação e Homeopatia', phone: '61 3536-2483 / 61 9 9201-6663', address: 'Rua 25 Sul, Lote 30, Loja 02, Park Style Mall, Águas Claras', contactInfo: 'fcaguasclaras@farmacerta.com.br', observations: null },
          { name: 'Priscila Barreto Terapeuta Homeopata', phone: '61 9 8483-1580', address: 'Maggiore Shopping Sala 105 - Águas Claras, Brasília - DF, 71936-250', contactInfo: null, observations: '(Não possui logo)' },
          { name: 'Meraki', phone: '61 9 9833-7744', address: 'Q. 104 Lote Quadra 104, 1310 - Águas Claras, Brasília - DF, 71900-100', contactInfo: null, observations: null },
        ]
      },
      {
        regionName: 'Núcleo Bandeirante',
        clinics: [
          { name: 'Farmahomeopatica Manipulação de Medicamentos LTDA', phone: '61 9 8294-3362 / 61 3386-1216', address: '3ª Avenida, comercial, 380 - 510 lote 450b loja - 1, Brasília - DF, 71720-515v', contactInfo: null, observations: null },
          { name: 'FARMACLÍNICA', phone: '61 3386-6406 / 61 9 9320-1038', address: 'Avenida Central 518/680 Lote 662 - Loja 01 - Núcleo Bandeirante, Brasília - DF, 71720-520', contactInfo: null, observations: null },
          { name: 'Centro Clinico Bandeirante', phone: '61 3022-0545 / 61 9 9207-7515', address: '2ª Avenida, Bloco 585A, Loja 01 - Térreo - Núcleo Bandeirante, Brasília - DF, 71705-500', contactInfo: 'fale.ccb@gmail.com (email)', observations: null },
          { name: 'Clínica Corpus', phone: '61 9 8148-3410', address: 'Av. Central, 655 - casa 7 - Núcleo Bandeirante, Brasília - DF, 71710-012', contactInfo: null, observations: null },
        ]
      },
      { regionName: 'Candangolândia', clinics: null },
      {
        regionName: 'Gama',
        clinics: [
          { name: 'Substractum', phone: '61 3384-4441 / 61 98347-2867', address: 'Quadra 40 lojas 20/22 - setor central comercial - Gama DF, Gama 72405400', contactInfo: null, observations: null },
          { name: 'Mesquita - Farmácia de Manipulação', phone: '61 3556-1920 / 61 9 8601-2257', address: 'St. Sul Quadra 01 conjunto A Lote 7 Loja 01 - Gama, Brasília - DF, 72410-110', contactInfo: null, observations: null },
          { name: 'Naturalmente Farmácia de Manipulação', phone: '61 9 9118-8653', address: 'St. Leste Q 23 CL 23 Loja 02 - Leste, Brasília - DF, 72460-230', contactInfo: null, observations: null },
        ]
      },
      { regionName: 'Riacho Fundo 1 e 2', clinics: null },
      {
        regionName: 'Taguatinga Sul e Norte',
        clinics: [
          { name: 'Instituto ITA', phone: '61 9 8478-2725 / 61 3352-6457', address: 'CSB 2 Lotes 01 a 04 Torre B, Sala 821, Alameda Shopping, Taguatinga - DF.', contactInfo: 'institutoitadf@gmail.com', observations: null },
          { name: 'Farmácia Homeopática Manah (1)', phone: '61 3563-7744', address: 'QSB 02 – Lote 20 – Ed. Manah – Loja 01', contactInfo: 'orcamento@farmaciamanah.com.br', observations: null },
          { name: 'Farmácia Homeopática Manah (2)', phone: '61 3033-4939', address: 'C 12 – Bloco B – Loja 01', contactInfo: 'orcamento@farmaciamanah.com.br', observations: null },
          { name: 'Sanar Restaure', phone: '61 99615-1953', address: 'St. B Sul QSB 02 Lote 20 Sala 201, Taguatinga, Federal District 72015-520', contactInfo: null, observations: null },
          { name: 'HOMEOPATIA SAUDE 100% ZEN - JOSE DE ASSIS', phone: '61 9 8535-4288', address: 'QNA 56 - CASA 11 Taguatinga Norte - Brasília- DF 72110560, BR', contactInfo: 'j.assis12@hotmail.com (email)', observations: null },
          { name: 'Essencial Farmácia de Manipulação', phone: '61 3242-9666 / 61 9 9319-2052', address: 'St. A Norte QNA 17 - Taguatinga, Brasília - DF, 72110-170', contactInfo: 'atendimento@essencialdf.com (site)', observations: null },
          { name: 'Farmacotécnica', phone: '61 3245-7667 / 61 9 9208-9912', address: 'St. Central C 8 Lote 11 Loja 1 Taguatinga - Centro, Brasília - DF, 72010-080', contactInfo: 'receitas@farmacotecnica.com.br', observations: null },
          { name: 'Farmácia Águiar', phone: '61 3351-2048', address: 'St. A Norte QNA 3 LOTE 33 LOJA 04 - Taguatinga, Brasília - DF, 72110-030', contactInfo: null, observations: null },
          { name: 'Quality Farmácia de Manipulação', phone: '61 3048-0700', address: 'Qsa11 LOTE 21 - Taguatinga Sul, Brasília - DF, 72015-110', contactInfo: 'sac@qualitymanipulacao.com.br (site)', observations: null },
          { name: 'Adilson Caetano - Acupuntura | Psicanálise | Quiropraxia', phone: '61 99829-3212', address: 'St. Central C 01, Lotes 01/12, Sala 1013, Taguatinga - Centro, Brasília - DF, 72010-010, Brasil', contactInfo: null, observations: null },
        ]
      },
    ]
  },
  {
    areas: 'Asa Sul/Norte, Lago Sul/Norte, Cruzeiro, Octogonal e Sudoeste',
    regions: [
      {
        regionName: 'Asa Sul',
        clinics: [
          { name: 'Vivenda', phone: '(61) 3445-1410', address: 'SHCS Quadra 415 BL B - Asa Sul, Brasília - DF, 70298-520', contactInfo: 'https://farmaciavivenda.com.br/ (site)', observations: null },
          { name: 'Farmacotécnica Matriz', phone: '(61) 3245-7667', address: 'SHLS Bloco 5 Loja 1/4 - Centro Médico de Brasília - Asa Sul, Brasília - DF, 70390-700', contactInfo: 'https://farmacotecnica.com.br/lojas-da-farmacotecnica (site)', observations: null },
          { name: 'Dr. Alexander J Saliba', phone: '(61) 3326-9242', address: 'SRTVS Q 701 BL B SALA 523 Sala 523 - Asa Sul, Brasília - DF, 70340-907', contactInfo: 'atendimento@salutare.com.br (site)', observations: null },
          { name: 'Dra. Regina França', phone: '(61) 3248-5636', address: 'SGAS II SGAS 611 BLOCO 2 SALA 236 - Centro Médico Lúcio Costa, Asa Sul, Brasília - DF, 70200-715', contactInfo: 'https://www.registrodemedicos.com.br/dra-regina-franca-pediatra-homeopata-em-brasilia/ (site)', observations: null },
          { name: 'Heloísa Rufino Terapeuta Homeopata', phone: '61 99800-6001', address: 'SEPS Q 705/905 Sul - Edifício Mont Blanc, Sala 10 - Asa Sul, Brasília - DF, 70297-400', contactInfo: 'https://www.terapeutaheloisa.com.br/ (site)', observations: null },
        ]
      },
      {
        regionName: 'Asa Norte',
        clinics: [
          { name: 'A Homeopática', phone: '61 3340-1573', address: 'Setor Shln Bloco M, 200, LOJA 24 192 E 200 EDIF MED CENTER, Asa Norte, Brasília/DF - CEP 70770-560', contactInfo: 'ahomeopaticadf@gmail.com (site)', observations: '(Não possui logo)' },
          { name: 'Medicare Homeopharma', phone: '61 3962-5033', address: 'CLN 402 Bloco C Loja 8 E 12 - Asa Norte, Brasília, DF, 70834-530', contactInfo: 'atendimento@monas.com.br (site)', observations: null },
          { name: 'Volta à Natureza', phone: '61 98276-2112', address: 'CLN 302 BL B Lojas 3 e 63 - Asa Norte, Brasília - DF, 70723-520', contactInfo: 'voltaanatureza@hotmail.com (email)', observations: null },
          { name: 'Frater Consultório Homeopático', phone: '61 99614-4231', address: 'Setor Terminal Norte, Conjunto O, sala 50, Edifício Life Center - Asa Norte, Brasília - DF, 70770-100', contactInfo: 'https://fraterhomeopatia.com.br (site)', observations: null },
          { name: 'PHARMAKON', phone: '61 3349-9596', address: 'Asa Norte CLN 405 Bloco E Loja 41 e 45 - Asa Norte, Brasília - DF, 70846-550', contactInfo: 'https://www.pharmakondf.com.br/ (site)', observations: null },
        ]
      },
      {
        regionName: 'Lago Sul',
        clinics: [
          { name: 'Pharmac', phone: '61 98165-4102', address: 'St. de Habitações Individuais Sul QI 13 Bloco H - Lago Sul, Brasília - DF, 71635-174', contactInfo: 'https://www.pharmac.com.br (site)', observations: null },
        ]
      },
      {
        regionName: 'Lago Norte',
        clinics: [
          { name: 'Clínica Seraphis', phone: '61 3468-6489', address: 'St. de Habitações Individuais Norte CA 9 (Centro de Atividades) Centro de Atividades LT 17 - Lago Norte, Brasília - DF, 71503-509', contactInfo: 'https://seraphis.com.br/ (site)', observations: null },
        ]
      },
      {
        regionName: 'Cruzeiro/Octogonal/Sudoeste',
        clinics: [
          { name: 'Dr. Ícaro Alves - Integrativo e Ortomolecular', phone: '61 99646-7775', address: 'Torre A AOS 2/8 lote 05, s/n - 232, AOS 4, Terraço Shopping, Brasília - DF, 70660-090', contactInfo: 'https://icaro.med.br/ (site)', observations: null },
          { name: 'Dias da Cruz Farmácia de Manipulação', phone: '61 994311212', address: 'Centro Clínico Sudoeste CHSW Blocos 3/4/5, 345 Setor Sudoeste CEP 70673-41', contactInfo: 'sudoestedias@gmail.com (email)', observations: null },
          { name: 'Via Magistral', phone: '61 3204-4440', address: 'Sudoeste Shopping Clsw 104 Bloco B s/n Loja 34, Cruzeiro / Sudoeste / Octogonal, Brasília - DF, 70670-532', contactInfo: 'https://linktr.ee/viamagistralbsb (email)', observations: null }, // Contato parece linktree, classificado como site
        ]
      },
    ]
  },
];
// --- FIM: Dados Clínicas Homeopáticas ---

const PublicUtilities = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [showHospitalPharmacies, setShowHospitalPharmacies] = useState(false);
  const [showHomeopathicClinics, setShowHomeopathicClinics] = useState(false);
  const [showPublicHospitals, setShowPublicHospitals] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Utilidades Públicas"
        description="Informações e serviços essenciais para sua saúde e bem-estar."
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Emergência',
          '2000',
          'Farmácia Popular',
          '2000',
          'Postos de Saúde',
          '2000',
          'Vacinação',
          '2000'
        ]}
      />

      {/* Container principal com margem adicionada */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:ml-72 space-y-12">
        {/* Emergency Contacts */}
        <section className="relative">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 -mt-20 relative z-10"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Telefones de Emergência</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {emergencyContacts.map((contact, index) => (
                <motion.div
                  key={contact.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <contact.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-1">{contact.label}</h3>
                  <p className="text-2xl font-bold text-red-600">{contact.number}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Services Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Serviços Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={HospitalIcon}
              title="Hospitais Públicos"
              description="Lista de hospitais da rede pública do DF"
              onClick={() => setShowPublicHospitals(true)}
            />
            <ServiceCard
              icon={Ambulance}
              title="Pronto Socorro"
              description="Unidades de emergência 24h"
            />
            <ServiceCard
              icon={Pill}
              title="Farmácias"
              description="Farmácias de plantão (geral)"
            />
            <ServiceCard
              icon={Health}
              title="UBS"
              description="Unidades Básicas de Saúde"
            />
            <ServiceCard
              icon={Pill}
              title="Farmácias Hospitalares"
              description="Locais que fornecem materiais hospitalares"
              onClick={() => setShowHospitalPharmacies(true)}
            />
            <ServiceCard
              icon={Leaf}
              title="Clínicas Homeopáticas"
              description="Clínicas e farmácias de homeopatia"
              onClick={() => setShowHomeopathicClinics(true)}
            />
          </div>
        </section>
      </div>

      {/* Modal Farmácias Hospitalares */}
      {showHospitalPharmacies && (
        <section className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <button
              onClick={() => setShowHospitalPharmacies(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-emerald-800">
              Farmácias Hospitalares e Materiais
            </h2>

            {Object.entries(groupedPharmacies).map(([city, pharmacies]) => (
              <div key={city} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-emerald-200 text-emerald-700">{city}</h3>
                <div className="space-y-6">
                  {pharmacies.map((pharmacy, index) => (
                    <div key={index} className="bg-white/70 p-4 rounded-lg shadow">
                      <h4 className="font-semibold text-lg text-gray-800 mb-2">{pharmacy.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {pharmacy.address && (
                          <p><span className="font-medium">Endereço:</span> {pharmacy.address}</p>
                        )}
                        {pharmacy.phone && (
                          <p><span className="font-medium">Telefone:</span> {pharmacy.phone}</p>
                        )}
                        {!pharmacy.email && (
                           <p><span className="font-medium">E-mail:</span> Não informado</p>
                        )}
                        {pharmacy.observations && (
                          <p><span className="font-medium">Obs:</span> {pharmacy.observations}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Modal Clínicas Homeopáticas */}
      {showHomeopathicClinics && (
        <section className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <button
              onClick={() => setShowHomeopathicClinics(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-teal-800">
              Clínicas Homeopáticas
            </h2>

            {/* --- INÍCIO: Conteúdo Renderizado Modificado --- */}
            <div className="space-y-8">
              {homeopathicData.map((areaGroup, groupIndex) => (
                <div key={groupIndex}>
                  <p className="text-lg font-semibold text-teal-700 mb-4">Áreas Administrativas: {areaGroup.areas}</p>
                  {areaGroup.regions.map((region, regionIndex) => (
                    <div key={regionIndex} className="mb-6 pl-4 border-l-2 border-teal-200">
                      <h4 className="text-xl font-semibold mb-3 text-teal-600">{region.regionName}</h4>
                      {region.clinics === null ? (
                        <p className="text-gray-500 italic">Não possui clínicas nesta região.</p>
                      ) : (
                        <div className="space-y-4">
                          {region.clinics.map((clinic, clinicIndex) => (
                            <div key={clinicIndex} className="bg-white/70 p-4 rounded-lg shadow">
                              <h5 className="font-semibold text-lg text-gray-800 mb-1">{clinic.name}</h5>
                              <div className="text-sm text-gray-600 space-y-0.5">
                                {clinic.address && (
                                  <p><span className="font-medium">Endereço:</span> {clinic.address}</p>
                                )}
                                <p><span className="font-medium">Telefone:</span> {clinic.phone || 'Não informado'}</p>
                                <p><span className="font-medium">E-mail/Site:</span> {clinic.contactInfo || 'Não informado'}</p>
                                {clinic.observations && (
                                  <p className="mt-1 pt-1 border-t border-gray-200 text-xs"><span className="font-medium">Obs:</span> {clinic.observations}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* --- FIM: Conteúdo Renderizado Modificado --- */}

          </motion.div>
        </section>
      )}

      {/* Modal Hospitais Públicos */}
      {showPublicHospitals && (
        <section className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <button
              onClick={() => setShowPublicHospitals(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">
              Hospitais Públicos
            </h2>

            <div className="space-y-6">
              {publicHospitalsData.map((hospital, index) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">{hospital.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {hospital.address && (
                      <p><span className="font-medium">Endereço:</span> {hospital.address}</p>
                    )}
                    {hospital.phone && (
                      <p><span className="font-medium">Telefone:</span> {hospital.phone}</p>
                    )}
                    <p><span className="font-medium">E-mail:</span> {hospital.email || 'Não informado'}</p>
                    {hospital.observation && (
                      <p className="mt-2 pt-2 border-t border-gray-200"><span className="font-medium">Observações:</span> {hospital.observation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description, onClick }: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick?: () => void;
}) => {
  const cardContent = (
    <>
      <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-verde-cia" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="bg-white p-6 rounded-xl shadow-lg text-left w-full"
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      {cardContent}
    </motion.div>
  );
};

export default PublicUtilities;