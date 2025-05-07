import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, Activity, Heart, Pill, Stethoscope, Thermometer, Brush as Virus } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  letter: string;
  image?: string;
}

// Expanded disease data with comprehensive entries starting with 'A'
const diseases: Disease[] = [
  {
    id: '1',
    name: 'Artrite',
    description: 'Inflamação das articulações que causa dor e rigidez.',
    symptoms: ['Dor nas articulações', 'Rigidez', 'Inchaço', 'Vermelhidão', 'Diminuição da amplitude de movimento'],
    treatments: ['Medicamentos anti-inflamatórios', 'Fisioterapia', 'Exercícios de fortalecimento', 'Terapia de calor e frio'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    name: 'Asma',
    description: 'Doença crônica que inflama e estreita as vias aéreas, causando dificuldade para respirar.',
    symptoms: ['Falta de ar', 'Chiado no peito', 'Tosse', 'Aperto no peito', 'Dificuldade para respirar'],
    treatments: ['Broncodilatadores', 'Corticosteroides inalatórios', 'Modificadores de leucotrienos', 'Plano de ação para asma'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '3',
    name: 'Anemia',
    description: 'Condição em que o corpo não tem glóbulos vermelhos saudáveis suficientes para transportar oxigênio adequadamente.',
    symptoms: ['Fadiga', 'Fraqueza', 'Pele pálida', 'Tontura', 'Batimentos cardíacos irregulares'],
    treatments: ['Suplementos de ferro', 'Vitamina B12', 'Ácido fólico', 'Mudanças na dieta', 'Transfusão de sangue em casos graves'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '4',
    name: 'Ansiedade',
    description: 'Transtorno caracterizado por sentimentos de preocupação, nervosismo ou medo intensos que interferem na vida diária.',
    symptoms: ['Preocupação excessiva', 'Inquietação', 'Tensão muscular', 'Dificuldade para dormir', 'Palpitações'],
    treatments: ['Terapia cognitivo-comportamental', 'Medicamentos ansiolíticos', 'Técnicas de relaxamento', 'Exercícios físicos regulares'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '5',
    name: 'Arritmia',
    description: 'Alteração no ritmo normal dos batimentos cardíacos, podendo ser mais rápido, mais lento ou irregular.',
    symptoms: ['Palpitações', 'Tontura', 'Falta de ar', 'Desmaio', 'Dor no peito'],
    treatments: ['Medicamentos antiarrítmicos', 'Marcapasso', 'Cardioversão', 'Ablação por cateter', 'Mudanças no estilo de vida'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '6',
    name: 'Artrose',
    description: 'Doença degenerativa das articulações que causa desgaste da cartilagem e inflamação.',
    symptoms: ['Dor articular', 'Rigidez', 'Inchaço', 'Crepitação', 'Limitação de movimento'],
    treatments: ['Analgésicos', 'Anti-inflamatórios', 'Fisioterapia', 'Exercícios de baixo impacto', 'Cirurgia em casos graves'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '7',
    name: 'Bronquite',
    description: 'Inflamação dos brônquios que causa tosse e dificuldade respiratória.',
    symptoms: ['Tosse', 'Falta de ar', 'Chiado no peito'],
    treatments: ['Broncodilatadores', 'Corticoides'],
    letter: 'B',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '8',
    name: 'Apendicite',
    description: 'Inflamação do apêndice que requer intervenção cirúrgica rápida.',
    symptoms: ['Dor abdominal intensa', 'Náusea', 'Vômito', 'Febre', 'Perda de apetite'],
    treatments: ['Apendicectomia (cirurgia)', 'Antibióticos', 'Analgésicos'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '9',
    name: 'Alzheimer',
    description: 'Doença neurodegenerativa progressiva que afeta a memória e as funções cognitivas.',
    symptoms: ['Perda de memória', 'Confusão', 'Dificuldade para realizar tarefas familiares', 'Alterações de personalidade'],
    treatments: ['Inibidores de colinesterase', 'Memantina', 'Terapia ocupacional', 'Suporte familiar'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1566669437687-7040a6926753?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '10',
    name: 'Aterosclerose',
    description: 'Acúmulo de placas de gordura, colesterol e outras substâncias nas paredes das artérias.',
    symptoms: ['Geralmente assintomática até estágios avançados', 'Dor no peito', 'Falta de ar', 'Fadiga', 'Confusão'],
    treatments: ['Estatinas', 'Anti-hipertensivos', 'Antiagregantes plaquetários', 'Mudanças no estilo de vida'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '11',
    name: 'Acne',
    description: 'Condição inflamatória da pele que causa espinhas, cravos e cistos.',
    symptoms: ['Espinhas', 'Cravos', 'Pústulas', 'Nódulos', 'Cicatrizes'],
    treatments: ['Retinoides tópicos', 'Antibióticos', 'Peróxido de benzoíla', 'Isotretinoína oral em casos graves'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '12',
    name: 'Anorexia Nervosa',
    description: 'Transtorno alimentar caracterizado por restrição severa de alimentos, medo intenso de ganhar peso e imagem corporal distorcida.',
    symptoms: ['Perda de peso extrema', 'Medo de ganhar peso', 'Imagem corporal distorcida', 'Amenorreia', 'Fadiga'],
    treatments: ['Terapia nutricional', 'Psicoterapia', 'Medicamentos', 'Hospitalização em casos graves'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '13',
    name: 'Arteriosclerose',
    description: 'Endurecimento e perda de elasticidade das paredes arteriais.',
    symptoms: ['Hipertensão', 'Dor no peito', 'Dor nas pernas ao caminhar', 'Confusão mental', 'Fraqueza'],
    treatments: ['Medicamentos para colesterol', 'Anti-hipertensivos', 'Anticoagulantes', 'Mudanças no estilo de vida'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '14',
    name: 'Amigdalite',
    description: 'Inflamação das amígdalas, geralmente causada por infecção viral ou bacteriana.',
    symptoms: ['Dor de garganta', 'Dificuldade para engolir', 'Febre', 'Mau hálito', 'Inchaço das amígdalas'],
    treatments: ['Antibióticos (se bacteriana)', 'Analgésicos', 'Gargarejo com água morna e sal', 'Repouso'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '15',
    name: 'Astigmatismo',
    description: 'Erro refrativo que causa visão distorcida devido à curvatura irregular da córnea ou do cristalino.',
    symptoms: ['Visão embaçada', 'Distorção visual', 'Fadiga ocular', 'Dores de cabeça', 'Dificuldade para dirigir à noite'],
    treatments: ['Óculos corretivos', 'Lentes de contato', 'Cirurgia refrativa', 'Ceratotomia'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '16',
    name: 'Autismo',
    description: 'Transtorno do neurodesenvolvimento caracterizado por dificuldades na comunicação social e comportamentos repetitivos.',
    symptoms: ['Dificuldade de interação social', 'Padrões repetitivos de comportamento', 'Interesses restritos', 'Atraso na fala'],
    treatments: ['Terapia comportamental', 'Terapia ocupacional', 'Fonoaudiologia', 'Intervenção precoce'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '17',
    name: 'Adenoma Hipofisário',
    description: 'Tumor benigno na glândula pituitária que pode afetar a produção hormonal.',
    symptoms: ['Dores de cabeça', 'Problemas de visão', 'Alterações hormonais', 'Fadiga', 'Alterações menstruais'],
    treatments: ['Cirurgia', 'Radioterapia', 'Medicamentos', 'Monitoramento regular'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '18',
    name: 'Aneurisma',
    description: 'Dilatação anormal de uma artéria que pode romper e causar hemorragia grave.',
    symptoms: ['Geralmente assintomático até a ruptura', 'Dor súbita e intensa', 'Náusea', 'Vômito', 'Rigidez no pescoço'],
    treatments: ['Cirurgia', 'Embolização endovascular', 'Controle da pressão arterial', 'Monitoramento'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '19',
    name: 'Artrite Reumatoide',
    description: 'Doença autoimune que causa inflamação crônica das articulações e tecidos circundantes.',
    symptoms: ['Dor articular', 'Rigidez matinal', 'Inchaço', 'Fadiga', 'Nódulos subcutâneos'],
    treatments: ['Anti-inflamatórios', 'Medicamentos antirreumáticos', 'Corticosteroides', 'Terapia biológica'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1616091238212-aca6808e3cf5?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '20',
    name: 'Apneia do Sono',
    description: 'Distúrbio do sono caracterizado por pausas na respiração durante o sono.',
    symptoms: ['Ronco alto', 'Pausas na respiração durante o sono', 'Sonolência diurna', 'Dores de cabeça matinais', 'Irritabilidade'],
    treatments: ['CPAP', 'Aparelhos orais', 'Perda de peso', 'Cirurgia em casos específicos'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '21',
    name: 'Ateroma',
    description: 'Acúmulo de gordura, colesterol e outras substâncias nas paredes das artérias.',
    symptoms: ['Geralmente assintomático', 'Dor no peito', 'Falta de ar', 'Fadiga', 'Sintomas de AVC ou infarto'],
    treatments: ['Estatinas', 'Anti-hipertensivos', 'Antiagregantes plaquetários', 'Mudanças no estilo de vida'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '22',
    name: 'Ataxia',
    description: 'Grupo de distúrbios que afetam a coordenação, equilíbrio e fala.',
    symptoms: ['Falta de coordenação', 'Marcha instável', 'Dificuldade para falar', 'Problemas de equilíbrio', 'Tremores'],
    treatments: ['Fisioterapia', 'Terapia ocupacional', 'Fonoaudiologia', 'Tratamento das causas subjacentes'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '23',
    name: 'Aterosclerose Coronariana',
    description: 'Acúmulo de placas nas artérias coronárias que pode levar a doenças cardíacas.',
    symptoms: ['Angina', 'Dor no peito', 'Falta de ar', 'Fadiga', 'Palpitações'],
    treatments: ['Estatinas', 'Anti-hipertensivos', 'Anticoagulantes', 'Angioplastia', 'Cirurgia de revascularização'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '24',
    name: 'Anemia Falciforme',
    description: 'Doença genética que afeta os glóbulos vermelhos, tornando-os em forma de foice.',
    symptoms: ['Crises de dor', 'Anemia', 'Infecções frequentes', 'Inchaço nas mãos e pés', 'Icterícia'],
    treatments: ['Hidroxiureia', 'Transfusões de sangue', 'Transplante de medula óssea', 'Manejo da dor'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '25',
    name: 'Anemia Perniciosa',
    description: 'Tipo de anemia causada pela incapacidade do corpo de absorver vitamina B12.',
    symptoms: ['Fadiga', 'Fraqueza', 'Formigamento nas extremidades', 'Problemas de equilíbrio', 'Confusão mental'],
    treatments: ['Injeções de vitamina B12', 'Suplementos orais de B12', 'Tratamento das causas subjacentes'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '26',
    name: 'Angina',
    description: 'Dor ou desconforto no peito causado pela redução do fluxo sanguíneo para o coração.',
    symptoms: ['Dor ou pressão no peito', 'Dor irradiando para o braço, pescoço ou mandíbula', 'Falta de ar', 'Náusea', 'Fadiga'],
    treatments: ['Nitroglicerina', 'Betabloqueadores', 'Bloqueadores dos canais de cálcio', 'Angioplastia', 'Cirurgia de revascularização'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '27',
    name: 'Anquilose',
    description: 'Rigidez ou fusão de uma articulação devido a doença, lesão ou procedimento cirúrgico.',
    symptoms: ['Rigidez articular', 'Limitação de movimento', 'Dor', 'Deformidade', 'Dificuldade para realizar atividades diárias'],
    treatments: ['Fisioterapia', 'Medicamentos para dor', 'Cirurgia em casos graves', 'Órteses'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '28',
    name: 'Agorafobia',
    description: 'Transtorno de ansiedade caracterizado pelo medo de lugares ou situações que possam causar pânico.',
    symptoms: ['Medo de espaços abertos', 'Medo de multidões', 'Ansiedade', 'Evitação de situações temidas', 'Ataques de pânico'],
    treatments: ['Terapia cognitivo-comportamental', 'Medicamentos ansiolíticos', 'Exposição gradual', 'Técnicas de relaxamento'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '29',
    name: 'Alopecia',
    description: 'Perda de cabelo que pode afetar o couro cabeludo ou outras áreas do corpo.',
    symptoms: ['Queda de cabelo', 'Áreas calvas no couro cabeludo', 'Perda de pelos corporais', 'Coceira ou ardência no couro cabeludo'],
    treatments: ['Minoxidil', 'Finasterida', 'Corticosteroides', 'Transplante capilar', 'Imunoterapia'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '30',
    name: 'Amenorreia',
    description: 'Ausência de menstruação em mulheres em idade reprodutiva.',
    symptoms: ['Ausência de menstruação', 'Alterações hormonais', 'Alterações de peso', 'Estresse', 'Exercício excessivo'],
    treatments: ['Tratamento hormonal', 'Mudanças no estilo de vida', 'Tratamento das causas subjacentes'],
    letter: 'A',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '31',
    name: 'Bulimia Nervosa',
    description: 'Transtorno alimentar caracterizado por episódios de compulsão alimentar seguidos por comportamentos compensatórios (vômitos, laxantes, etc.).',
    symptoms: ['Compulsão alimentar', 'Vômitos autoinduzidos', 'Uso de laxantes/diuréticos', 'Preocupação excessiva com peso/forma corporal'],
    treatments: ['Psicoterapia', 'Terapia nutricional', 'Medicamentos antidepressivos', 'Grupos de apoio'],
    letter: 'B',
    image: 'https://images.unsplash.com/photo-1579047064810-807c6a7651b2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '32',
    name: 'Bursite',
    description: 'Inflamação da bursa, uma pequena bolsa cheia de líquido que atua como amortecedor entre ossos, tendões e músculos.',
    symptoms: ['Dor articular', 'Inchaço', 'Sensibilidade', 'Vermelhidão', 'Movimento limitado'],
    treatments: ['Repouso', 'Gelo', 'Anti-inflamatórios', 'Fisioterapia', 'Injeções de corticosteroides'],
    letter: 'B',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '33',
    name: 'Câncer',
    description: 'Grupo de doenças caracterizadas pelo crescimento descontrolado de células anormais que podem invadir outras partes do corpo.',
    symptoms: ['Variam amplamente dependendo do tipo e localização', 'Perda de peso inexplicada', 'Fadiga', 'Dor', 'Alterações na pele'],
    treatments: ['Cirurgia', 'Quimioterapia', 'Radioterapia', 'Imunoterapia', 'Terapia-alvo'],
    letter: 'C',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '34',
    name: 'Catarata',
    description: 'Opacificação do cristalino do olho, que leva à diminuição progressiva da visão.',
    symptoms: ['Visão embaçada ou nublada', 'Dificuldade para enxergar à noite', 'Sensibilidade à luz', 'Visão dupla'],
    treatments: ['Cirurgia para substituir o cristalino opaco por uma lente artificial', 'Óculos (em fases iniciais)'],
    letter: 'C',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '35',
    name: 'Cirrose',
    description: 'Estágio final de cicatrização (fibrose) do fígado causada por várias formas de doenças hepáticas.',
    symptoms: ['Fadiga', 'Perda de apetite', 'Náusea', 'Inchaço abdominal (ascite)', 'Icterícia'],
    treatments: ['Tratamento da causa subjacente', 'Dieta balanceada', 'Evitar álcool', 'Medicamentos para complicações', 'Transplante de fígado'],
    letter: 'C',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300' // Imagem genérica de saúde
  },
  {
    id: '36',
    name: 'Diabetes Mellitus',
    description: 'Doença metabólica caracterizada por níveis elevados de glicose no sangue (açúcar no sangue).',
    symptoms: ['Aumento da sede', 'Aumento da fome', 'Micção frequente', 'Perda de peso inexplicada', 'Fadiga', 'Visão turva'],
    treatments: ['Insulina', 'Medicamentos orais', 'Monitoramento da glicose', 'Dieta saudável', 'Exercícios físicos'],
    letter: 'D',
    image: 'https://images.unsplash.com/photo-1523741543342-41d93a13b8a5?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '37',
    name: 'Depressão',
    description: 'Transtorno de humor que causa um sentimento persistente de tristeza e perda de interesse.',
    symptoms: ['Humor deprimido', 'Perda de interesse ou prazer', 'Alterações no apetite/peso', 'Problemas de sono', 'Fadiga', 'Sentimentos de inutilidade'],
    treatments: ['Psicoterapia', 'Medicamentos antidepressivos', 'Exercícios físicos', 'Mudanças no estilo de vida'],
    letter: 'D',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '38',
    name: 'Dermatite',
    description: 'Termo geral para inflamação da pele.',
    symptoms: ['Pele seca', 'Coceira', 'Vermelhidão', 'Inchaço', 'Bolhas ou crostas (em alguns tipos)'],
    treatments: ['Cremes/pomadas de corticosteroides', 'Anti-histamínicos', 'Hidratantes', 'Evitar gatilhos'],
    letter: 'D',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '39',
    name: 'Epilepsia',
    description: 'Distúrbio neurológico caracterizado por convulsões recorrentes.',
    symptoms: ['Convulsões', 'Perda de consciência', 'Movimentos involuntários', 'Sensações estranhas', 'Confusão pós-convulsão'],
    treatments: ['Medicamentos anticonvulsivantes', 'Dieta cetogênica', 'Cirurgia', 'Estimulação do nervo vago'],
    letter: 'E',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300' // Imagem genérica neuro
  },
  {
    id: '40',
    name: 'Esclerose Múltipla',
    description: 'Doença autoimune que afeta o cérebro e a medula espinhal, causando danos à mielina.',
    symptoms: ['Fadiga', 'Dificuldade para andar', 'Formigamento ou dormência', 'Problemas de visão', 'Espasmos musculares'],
    treatments: ['Medicamentos modificadores da doença', 'Corticosteroides', 'Fisioterapia', 'Terapia ocupacional'],
    letter: 'E',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '41',
    name: 'Endometriose',
    description: 'Condição em que o tecido semelhante ao revestimento do útero cresce fora do útero.',
    symptoms: ['Dor pélvica intensa (especialmente durante a menstruação)', 'Dor durante a relação sexual', 'Sangramento menstrual intenso', 'Infertilidade'],
    treatments: ['Analgésicos', 'Terapia hormonal', 'Cirurgia conservadora', 'Histerectomia em casos graves'],
    letter: 'E',
    image: 'https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&q=80&w=300' // Imagem genérica sistema reprodutivo
  },
  {
    id: '42',
    name: 'Fibromialgia',
    description: 'Distúrbio caracterizado por dor musculoesquelética generalizada acompanhada por fadiga, sono, problemas de memória e humor.',
    symptoms: ['Dor generalizada', 'Fadiga', 'Dificuldades cognitivas (névoa de fibro)', 'Distúrbios do sono', 'Dores de cabeça'],
    treatments: ['Analgésicos', 'Antidepressivos', 'Anticonvulsivantes', 'Exercícios', 'Técnicas de gerenciamento de estresse'],
    letter: 'F',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300' // Imagem genérica dor/fadiga
  },
  {
    id: '43',
    name: 'Faringite',
    description: 'Inflamação da faringe, geralmente causando dor de garganta.',
    symptoms: ['Dor de garganta', 'Dificuldade para engolir', 'Gânglios linfáticos inchados', 'Febre', 'Dor de cabeça'],
    treatments: ['Analgésicos', 'Anti-inflamatórios', 'Pastilhas para garganta', 'Antibióticos (se bacteriana)', 'Repouso'],
    letter: 'F',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300' // Imagem genérica garganta/respiração
  },
  {
    id: '44',
    name: 'Gastrite',
    description: 'Inflamação do revestimento do estômago.',
    symptoms: ['Dor ou queimação no estômago', 'Náusea', 'Vômito', 'Sensação de plenitude após comer', 'Perda de apetite'],
    treatments: ['Antiácidos', 'Inibidores da bomba de prótons', 'Antibióticos (se H. pylori)', 'Mudanças na dieta'],
    letter: 'G',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300' // Imagem genérica sistema digestivo
  },
  {
    id: '45',
    name: 'Glaucoma',
    description: 'Grupo de doenças oculares que danificam o nervo óptico, geralmente devido ao aumento da pressão intraocular.',
    symptoms: ['Perda gradual da visão periférica', 'Visão em túnel (em estágios avançados)', 'Dores de cabeça', 'Visão turva', 'Halos ao redor das luzes'],
    treatments: ['Colírios para reduzir a pressão ocular', 'Tratamento a laser', 'Cirurgia'],
    letter: 'G',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300' // Imagem olho
  },
  {
    id: '46',
    name: 'Gota',
    description: 'Forma de artrite inflamatória causada pelo acúmulo de cristais de ácido úrico nas articulações.',
    symptoms: ['Dor articular intensa (geralmente no dedão do pé)', 'Inchaço', 'Vermelhidão', 'Calor na articulação afetada', 'Sensibilidade extrema'],
    treatments: ['Anti-inflamatórios não esteroides (AINEs)', 'Colchicina', 'Corticosteroides', 'Medicamentos para reduzir o ácido úrico'],
    letter: 'G',
    image: 'https://images.unsplash.com/photo-1616091238212-aca6808e3cf5?auto=format&fit=crop&q=80&w=300' // Imagem articulação
  },
  {
    id: '47',
    name: 'Hepatite',
    description: 'Inflamação do fígado, geralmente causada por vírus, toxinas ou condições autoimunes.',
    symptoms: ['Icterícia (pele e olhos amarelados)', 'Dor abdominal', 'Fadiga', 'Náuseas e vômitos', 'Urina escura'],
    treatments: ['Repouso', 'Hidratação adequada', 'Antivirais (dependendo do tipo)', 'Transplante hepático (casos graves)'],
    letter: 'H',
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '48',
    name: 'Hipertensão',
    description: 'Pressão arterial elevada e persistente nas artérias, aumentando o risco de várias doenças cardiovasculares.',
    symptoms: ['Geralmente assintomática', 'Dores de cabeça', 'Tontura', 'Visão embaçada', 'Sangramento nasal'],
    treatments: ['Diuréticos', 'Betabloqueadores', 'Inibidores da ECA', 'Dieta com baixo teor de sódio', 'Atividade física regular'],
    letter: 'H',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '49',
    name: 'Hérnia de Disco',
    description: 'Deslocamento de parte do disco intervertebral, comprimindo nervos próximos e causando dor.',
    symptoms: ['Dor nas costas ou pescoço', 'Dor irradiando para braços ou pernas', 'Formigamento', 'Fraqueza muscular'],
    treatments: ['Repouso', 'Fisioterapia', 'Medicamentos para dor', 'Injeções de corticosteroides', 'Cirurgia em casos graves'],
    letter: 'H',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '50',
    name: 'Hipotireoidismo',
    description: 'Condição em que a glândula tireoide não produz hormônios suficientes.',
    symptoms: ['Fadiga', 'Sensibilidade ao frio', 'Constipação', 'Pele seca', 'Ganho de peso', 'Depressão'],
    treatments: ['Reposição hormonal (Levotiroxina)', 'Monitoramento regular dos níveis hormonais', 'Ajustes na dieta'],
    letter: 'H',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '51',
    name: 'Insuficiência Cardíaca',
    description: 'Condição em que o coração não consegue bombear sangue suficiente para atender às necessidades do corpo.',
    symptoms: ['Falta de ar', 'Fadiga', 'Inchaço nas pernas e tornozelos', 'Batimentos cardíacos acelerados', 'Tosse persistente'],
    treatments: ['Inibidores da ECA', 'Betabloqueadores', 'Diuréticos', 'Dispositivos cardíacos', 'Transplante cardíaco em casos graves'],
    letter: 'I',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '52',
    name: 'Insônia',
    description: 'Distúrbio do sono caracterizado pela dificuldade em adormecer ou permanecer dormindo.',
    symptoms: ['Dificuldade para adormecer', 'Acordar durante a noite', 'Acordar muito cedo', 'Sonolência diurna', 'Irritabilidade'],
    treatments: ['Terapia cognitivo-comportamental', 'Medicamentos hipnóticos', 'Higiene do sono', 'Técnicas de relaxamento'],
    letter: 'I',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '53',
    name: 'Infarto do Miocárdio',
    description: 'Morte do tecido cardíaco resultante da interrupção do fluxo sanguíneo para o coração.',
    symptoms: ['Dor ou pressão no peito', 'Dor irradiando para o braço, mandíbula ou costas', 'Falta de ar', 'Náusea', 'Suor frio'],
    treatments: ['Trombolíticos', 'Angioplastia', 'Stents coronários', 'Cirurgia de revascularização', 'Medicamentos cardiovasculares'],
    letter: 'I',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '54',
    name: 'Infecção Urinária',
    description: 'Infecção que afeta qualquer parte do sistema urinário, incluindo rins, bexiga, ureteres e uretra.',
    symptoms: ['Micção frequente', 'Sensação de queimação ao urinar', 'Urina turva ou com odor forte', 'Dor pélvica', 'Sangue na urina'],
    treatments: ['Antibióticos', 'Analgésicos', 'Aumento da ingestão de líquidos', 'Probióticos'],
    letter: 'I',
    image: 'https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '55',
    name: 'Joanete',
    description: 'Deformidade óssea que se desenvolve na articulação na base do dedão do pé.',
    symptoms: ['Protuberância óssea na base do dedão', 'Dor e sensibilidade', 'Vermelhidão e inflamação', 'Movimento limitado do dedão'],
    treatments: ['Calçados adequados', 'Protetores de joanete', 'Anti-inflamatórios', 'Cirurgia em casos graves'],
    letter: 'J',
    image: 'https://images.unsplash.com/photo-1616091238212-aca6808e3cf5?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '56',
    name: 'Jejum Intermitente',
    description: 'Não é uma doença, mas um padrão alimentar que alterna entre períodos de alimentação e jejum.',
    symptoms: ['Pode causar irritabilidade', 'Fome', 'Fadiga inicial', 'Dificuldade de concentração'],
    treatments: ['Acompanhamento nutricional', 'Monitoramento médico', 'Hidratação adequada', 'Não recomendado para certas condições médicas'],
    letter: 'J',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '57',
    name: 'Klebsiella',
    description: 'Infecção bacteriana causada por bactérias Klebsiella, geralmente afetando os pulmões ou o trato urinário.',
    symptoms: ['Febre', 'Calafrios', 'Tosse com expectoração', 'Dificuldade respiratória', 'Dor ao urinar (infecções urinárias)'],
    treatments: ['Antibióticos específicos', 'Hidratação', 'Oxigenoterapia (casos respiratórios graves)', 'Tratamento hospitalar em casos graves'],
    letter: 'K',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '58',
    name: 'Kernicterus',
    description: 'Forma rara de dano cerebral causado por níveis muito altos de bilirrubina em bebês recém-nascidos.',
    symptoms: ['Icterícia intensa', 'Letargia', 'Tônus muscular anormal', 'Febre', 'Choro agudo'],
    treatments: ['Fototerapia intensiva', 'Exsanguineotransfusão', 'Tratamento precoce da hiperbilirrubinemia', 'Suporte neurológico'],
    letter: 'K',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '59',
    name: 'Labirintite',
    description: 'Inflamação do labirinto do ouvido interno, afetando o equilíbrio e a audição.',
    symptoms: ['Tontura intensa', 'Vertigem', 'Náusea', 'Vômito', 'Perda de equilíbrio', 'Zumbido no ouvido'],
    treatments: ['Medicamentos antivertiginosos', 'Antieméticos', 'Repouso', 'Exercícios de reabilitação vestibular'],
    letter: 'L',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '60',
    name: 'Lúpus Eritematoso Sistêmico',
    description: 'Doença autoimune crônica em que o sistema imunológico ataca os próprios tecidos e órgãos do corpo.',
    symptoms: ['Erupção cutânea em forma de borboleta no rosto', 'Fadiga', 'Dor articular', 'Fotossensibilidade', 'Febre'],
    treatments: ['Anti-inflamatórios', 'Corticosteroides', 'Imunossupressores', 'Antimaláricos', 'Terapia biológica'],
    letter: 'L',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '61',
    name: 'Leucemia',
    description: 'Câncer que afeta as células sanguíneas, geralmente começando na medula óssea.',
    symptoms: ['Fadiga persistente', 'Infecções frequentes', 'Febre', 'Sangramentos ou hematomas facilmente', 'Perda de peso'],
    treatments: ['Quimioterapia', 'Radioterapia', 'Transplante de medula óssea', 'Imunoterapia', 'Terapia direcionada'],
    letter: 'L',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '62',
    name: 'Meningite',
    description: 'Inflamação das membranas (meninges) que revestem o cérebro e a medula espinhal.',
    symptoms: ['Febre alta', 'Dor de cabeça severa', 'Rigidez no pescoço', 'Fotofobia (sensibilidade à luz)', 'Náusea e vômito'],
    treatments: ['Antibióticos (meningite bacteriana)', 'Antivirais (meningite viral)', 'Corticosteroides', 'Terapia de suporte'],
    letter: 'M',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '63',
    name: 'Mal de Parkinson',
    description: 'Distúrbio neurodegenerativo progressivo que afeta o movimento e frequentemente causa tremores.',
    symptoms: ['Tremor em repouso', 'Rigidez muscular', 'Bradicinesia (lentidão de movimento)', 'Instabilidade postural', 'Alterações na fala'],
    treatments: ['Levodopa', 'Agonistas dopaminérgicos', 'Inibidores da MAO-B', 'Estimulação cerebral profunda', 'Fisioterapia'],
    letter: 'M',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '64',
    name: 'Miocardite',
    description: 'Inflamação do músculo cardíaco (miocárdio), geralmente causada por infecção viral.',
    symptoms: ['Dor no peito', 'Fadiga', 'Falta de ar', 'Palpitações', 'Inchaço nas pernas'],
    treatments: ['Repouso', 'Medicamentos para insuficiência cardíaca', 'Anti-inflamatórios', 'Imunossupressores em casos específicos'],
    letter: 'M',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '65',
    name: 'Mononucleose',
    description: 'Infecção viral comumente causada pelo vírus Epstein-Barr (EBV), afetando principalmente adolescentes e adultos jovens.',
    symptoms: ['Fadiga extrema', 'Dor de garganta', 'Febre', 'Gânglios linfáticos inchados', 'Baço aumentado'],
    treatments: ['Repouso', 'Analgésicos', 'Hidratação', 'Evitar atividades físicas intensas durante a recuperação'],
    letter: 'M',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '66',
    name: 'Nefrite',
    description: 'Inflamação dos rins, geralmente causada por infecções, doenças autoimunes ou reações a medicamentos.',
    symptoms: ['Inchaço (edema)', 'Urina com sangue', 'Pressão arterial alta', 'Fadiga', 'Náusea'],
    treatments: ['Medicamentos anti-inflamatórios', 'Imunossupressores', 'Antibióticos (se infecciosa)', 'Controle da pressão arterial'],
    letter: 'N',
    image: 'https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '67',
    name: 'Neuralgia do Trigêmeo',
    description: 'Distúrbio nervoso que causa dor facial intensa, breve e recorrente.',
    symptoms: ['Dor facial aguda e lancinante', 'Episódios de dor desencadeados por atividades cotidianas', 'Dor em áreas específicas do rosto'],
    treatments: ['Medicamentos anticonvulsivantes', 'Relaxantes musculares', 'Procedimentos cirúrgicos', 'Bloqueios nervosos'],
    letter: 'N',
    image: 'https://images.unsplash.com/photo-1559757148-3c050d252070?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '68',
    name: 'Narcolepsia',
    description: 'Distúrbio do sono crônico caracterizado por sonolência diurna excessiva e episódios repentinos de sono.',
    symptoms: ['Sonolência diurna excessiva', 'Cataplexia (perda súbita do tônus muscular)', 'Alucinações hipnagógicas', 'Paralisia do sono'],
    treatments: ['Estimulantes', 'Antidepressivos', 'Oxibato de sódio', 'Terapia comportamental do sono'],
    letter: 'N',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '69',
    name: 'Obesidade',
    description: 'Condição médica caracterizada pelo acúmulo excessivo de gordura corporal, representando risco para a saúde.',
    symptoms: ['IMC acima de 30', 'Circunferência abdominal aumentada', 'Dificuldade respiratória', 'Dores articulares', 'Fadiga'],
    treatments: ['Dieta balanceada', 'Exercícios físicos regulares', 'Terapia comportamental', 'Medicamentos para perda de peso', 'Cirurgia bariátrica em casos graves'],
    letter: 'O',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '70',
    name: 'Otite',
    description: 'Inflamação ou infecção do ouvido, podendo afetar o ouvido externo, médio ou interno.',
    symptoms: ['Dor de ouvido', 'Febre', 'Diminuição da audição', 'Secreção no ouvido', 'Tontura (em alguns casos)'],
    treatments: ['Antibióticos (se bacteriana)', 'Analgésicos', 'Gotas otológicas', 'Drenagem (em casos graves)'],
    letter: 'O',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '71',
    name: 'Osteoporose',
    description: 'Doença que enfraquece os ossos, tornando-os frágeis e mais propensos a fraturas.',
    symptoms: ['Geralmente assintomática até ocorrer fratura', 'Dor nas costas', 'Perda de altura', 'Postura curvada', 'Fraturas ósseas com trauma mínimo'],
    treatments: ['Suplementos de cálcio e vitamina D', 'Medicamentos para aumentar a densidade óssea', 'Exercícios de fortalecimento', 'Prevenção de quedas'],
    letter: 'O',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '72',
    name: 'Pneumonia',
    description: 'Infecção que inflama os sacos aéreos em um ou ambos os pulmões, podendo ser causada por bactérias, vírus ou fungos.',
    symptoms: ['Tosse com catarro', 'Febre', 'Calafrios', 'Dificuldade respiratória', 'Dor torácica ao respirar ou tossir'],
    treatments: ['Antibióticos (pneumonia bacteriana)', 'Antivirais (pneumonia viral)', 'Antifúngicos (pneumonia fúngica)', 'Oxigenoterapia', 'Repouso'],
    letter: 'P',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '73',
    name: 'Psoríase',
    description: 'Doença autoimune crônica que acelera o ciclo de vida das células da pele, causando acúmulo de células na superfície da pele.',
    symptoms: ['Placas de pele espessas e avermelhadas', 'Escamas prateadas na pele', 'Pele seca e rachada', 'Coceira', 'Unhas engrossadas'],
    treatments: ['Corticosteroides tópicos', 'Retinoides', 'Fototerapia', 'Imunossupressores', 'Agentes biológicos'],
    letter: 'P',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '74',
    name: 'Pancreatite',
    description: 'Inflamação do pâncreas, que pode ser aguda ou crônica.',
    symptoms: ['Dor abdominal intensa', 'Náusea', 'Vômito', 'Febre', 'Frequência cardíaca acelerada'],
    treatments: ['Jejum', 'Analgésicos', 'Hidratação intravenosa', 'Tratamento da causa subjacente', 'Cirurgia em casos graves'],
    letter: 'P',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '75',
    name: 'Queimadura',
    description: 'Lesão na pele ou outros tecidos causada por calor, frio, eletricidade, produtos químicos, radiação ou fricção.',
    symptoms: ['Dor', 'Vermelhidão', 'Inchaço', 'Bolhas', 'Pele esbranquiçada ou carbonizada (em queimaduras graves)'],
    treatments: ['Resfriamento da área', 'Analgésicos', 'Tratamento antimicrobiano', 'Curativos especializados', 'Enxerto de pele em casos graves'],
    letter: 'Q',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '76',
    name: 'Quadro Depressivo',
    description: 'Estado de depressão que pode variar em intensidade e duração, afetando o humor, os pensamentos e o comportamento.',
    symptoms: ['Tristeza persistente', 'Perda de interesse', 'Alterações no sono', 'Fadiga', 'Pensamentos suicidas'],
    treatments: ['Psicoterapia', 'Antidepressivos', 'Terapia eletroconvulsiva (casos graves)', 'Atividade física', 'Mindfulness'],
    letter: 'Q',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '77',
    name: 'Rinite',
    description: 'Inflamação do revestimento mucoso do nariz, frequentemente causada por alergias ou infecções.',
    symptoms: ['Congestão nasal', 'Coriza', 'Espirros', 'Coceira no nariz', 'Olhos lacrimejantes'],
    treatments: ['Anti-histamínicos', 'Corticosteroides nasais', 'Descongestionantes', 'Imunoterapia (em rinite alérgica)', 'Evitar alérgenos'],
    letter: 'R',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '78',
    name: 'Reumatismo',
    description: 'Termo que se refere a várias condições que causam dor e inflamação nos músculos, articulações, ossos e ligamentos.',
    symptoms: ['Dor articular', 'Rigidez', 'Inchaço', 'Limitação de movimento', 'Deformidade (em casos avançados)'],
    treatments: ['Anti-inflamatórios', 'Analgésicos', 'Fisioterapia', 'Terapia ocupacional', 'Medicamentos antirreumáticos'],
    letter: 'R',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '79',
    name: 'Retinopatia Diabética',
    description: 'Complicação do diabetes que afeta os vasos sanguíneos da retina, podendo levar à perda de visão.',
    symptoms: ['Visão embaçada', 'Flutuações na visão', 'Manchas escuras', 'Dificuldade para ver à noite', 'Perda de visão'],
    treatments: ['Controle do diabetes', 'Fotocoagulação a laser', 'Medicamentos intravitreos', 'Vitrectomia', 'Exames oftalmológicos regulares'],
    letter: 'R',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '80',
    name: 'Síndrome do Intestino Irritável',
    description: 'Distúrbio intestinal crônico que causa dor abdominal, inchaço, diarreia e/ou constipação.',
    symptoms: ['Dor abdominal', 'Alterações nos hábitos intestinais', 'Inchaço', 'Gases', 'Sensação de evacuação incompleta'],
    treatments: ['Mudanças na dieta', 'Medicamentos para dor e cólicas', 'Antidepressivos', 'Terapia comportamental', 'Probióticos'],
    letter: 'S',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '81',
    name: 'Sarampo',
    description: 'Doença viral altamente contagiosa caracterizada por erupção cutânea, febre e sintomas respiratórios.',
    symptoms: ['Erupção cutânea vermelha', 'Febre alta', 'Tosse', 'Coriza', 'Conjuntivite', 'Manchas de Koplik (manchas brancas na boca)'],
    treatments: ['Não há tratamento específico', 'Repouso', 'Hidratação', 'Analgésicos', 'Vitamina A', 'Vacinação preventiva'],
    letter: 'S',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '82',
    name: 'Síndrome de Down',
    description: 'Condição genética causada pela presença de um cromossomo 21 extra, resultando em características físicas distintas e deficiência intelectual.',
    symptoms: ['Características faciais distintas', 'Hipotonia muscular', 'Baixa estatura', 'Atraso no desenvolvimento', 'Anomalias cardíacas congênitas'],
    treatments: ['Intervenção precoce', 'Fisioterapia', 'Fonoaudiologia', 'Educação especial', 'Tratamento de condições associadas'],
    letter: 'S',
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '83',
    name: 'Tuberculose',
    description: 'Doença infecciosa causada pela bactéria Mycobacterium tuberculosis, afetando principalmente os pulmões.',
    symptoms: ['Tosse persistente (mais de três semanas)', 'Expectoração com sangue', 'Dor no peito', 'Febre', 'Perda de peso', 'Suores noturnos'],
    treatments: ['Antibióticos específicos por 6-9 meses', 'Isolamento em casos ativos', 'Terapia diretamente observada', 'Suporte nutricional'],
    letter: 'T',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '84',
    name: 'Transtorno de Ansiedade',
    description: 'Grupo de transtornos mentais caracterizados por sentimentos de medo e ansiedade intensos e persistentes.',
    symptoms: ['Preocupação excessiva', 'Inquietação', 'Fadiga', 'Dificuldade de concentração', 'Tensão muscular', 'Distúrbios do sono'],
    treatments: ['Psicoterapia', 'Medicamentos ansiolíticos', 'Técnicas de relaxamento', 'Mudanças no estilo de vida', 'Exercícios físicos'],
    letter: 'T',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '85',
    name: 'Trombose',
    description: 'Formação de coágulo sanguíneo dentro de um vaso sanguíneo, obstruindo o fluxo de sangue.',
    symptoms: ['Dor local', 'Inchaço', 'Vermelhidão', 'Sensação de calor', 'Dificuldade para respirar (trombose pulmonar)'],
    treatments: ['Anticoagulantes', 'Trombolíticos', 'Filtros de veia cava', 'Meias de compressão', 'Mudanças no estilo de vida'],
    letter: 'T',
    image: 'https://images.unsplash.com/photo-1559757175-7b21e5afae2a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '86',
    name: 'Úlcera Péptica',
    description: 'Ferida aberta na mucosa do estômago, esôfago inferior ou duodeno, causada por ácido estomacal.',
    symptoms: ['Dor abdominal', 'Azia', 'Náusea', 'Sensação de plenitude', 'Sangue nas fezes ou vômito'],
    treatments: ['Inibidores da bomba de prótons', 'Antibióticos (se H. pylori)', 'Antiácidos', 'Evitar alimentos irritantes', 'Cirurgia em casos graves'],
    letter: 'U',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '87',
    name: 'Urticária',
    description: 'Reação cutânea alérgica caracterizada por elevações avermelhadas e pruriginosas na pele.',
    symptoms: ['Manchas avermelhadas na pele', 'Coceira intensa', 'Inchaço', 'Sensação de queimação', 'Angioedema (em casos graves)'],
    treatments: ['Anti-histamínicos', 'Corticosteroides', 'Epinefrina (casos graves)', 'Evitar alérgenos', 'Compressas frias'],
    letter: 'U',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '88',
    name: 'Varizes',
    description: 'Veias dilatadas e tortuosas, geralmente nas pernas, causadas por válvulas venosas danificadas ou fracas.',
    symptoms: ['Veias visíveis e protuberantes', 'Dor nas pernas', 'Sensação de peso', 'Coceira', 'Cãibras musculares', 'Edema'],
    treatments: ['Meias de compressão', 'Escleroterapia', 'Terapia a laser', 'Cirurgia', 'Elevação das pernas', 'Exercícios'],
    letter: 'V',
    image: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '89',
    name: 'Vitiligo',
    description: 'Doença autoimune que causa a perda de pigmento da pele em áreas irregulares.',
    symptoms: ['Manchas brancas na pele', 'Perda de cor no cabelo', 'Descoloração da boca e nariz', 'Perda de cor nas retinas'],
    treatments: ['Corticosteroides tópicos', 'Inibidores de calcineurina', 'Fototerapia', 'Transplante de melanócitos', 'Maquiagem corretiva'],
    letter: 'V',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '90',
    name: 'Vaginite',
    description: 'Inflamação ou infecção da vagina que pode causar corrimento, coceira e dor.',
    symptoms: ['Corrimento vaginal anormal', 'Coceira', 'Ardência', 'Odor desagradável', 'Dor durante a relação sexual'],
    treatments: ['Antibióticos (vaginose bacteriana)', 'Antifúngicos (candidíase)', 'Anti-protozoários (tricomoníase)', 'Higiene adequada'],
    letter: 'V',
    image: 'https://images.unsplash.com/photo-1600443299762-7a743123645d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '91',
    name: 'Xeroftalmia',
    description: 'Condição ocular caracterizada pela secura anormal da conjuntiva e da córnea, frequentemente causada por deficiência de vitamina A.',
    symptoms: ['Olhos secos', 'Sensação de areia nos olhos', 'Coceira', 'Ardência', 'Sensibilidade à luz', 'Dificuldade para enxergar à noite'],
    treatments: ['Suplementação de vitamina A', 'Lágrimas artificiais', 'Mudanças na dieta', 'Umidificadores ambientais', 'Controle de doenças subjacentes'],
    letter: 'X',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '92',
    name: 'Xantoma',
    description: 'Depósitos de gordura amarelados que se desenvolvem sob a pele, frequentemente associados a distúrbios no metabolismo dos lipídios.',
    symptoms: ['Caroços amarelados sob a pele', 'Manchas elevadas nas pálpebras', 'Nódulos nos tendões', 'Geralmente indolores'],
    treatments: ['Tratamento da condição subjacente (como hipercolesterolemia)', 'Estatinas', 'Remoção cirúrgica', 'Dieta com baixo teor de gordura'],
    letter: 'X',
    image: 'https://images.unsplash.com/photo-1513165533842-511b7f2ef356?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '93',
    name: 'Yellow Nail Syndrome',
    description: 'Síndrome rara caracterizada por unhas amareladas e espessas, problemas respiratórios e inchaço nos membros.',
    symptoms: ['Unhas amareladas e espessas', 'Crescimento lento das unhas', 'Inchaço nos membros', 'Problemas respiratórios crônicos', 'Sinusite'],
    treatments: ['Tratamento da condição subjacente', 'Antibióticos para infecções', 'Vitamina E', 'Drenagem linfática', 'Terapia antifúngica'],
    letter: 'Y',
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '94',
    name: 'Yersiniose',
    description: 'Infecção bacteriana intestinal causada pela bactéria Yersinia, geralmente contraída por consumo de alimentos contaminados.',
    symptoms: ['Dor abdominal', 'Febre', 'Diarreia', 'Náusea', 'Vômito', 'Dor nas articulações (em alguns casos)'],
    treatments: ['Antibióticos', 'Hidratação', 'Repouso', 'Tratamento sintomático', 'Medidas de segurança alimentar'],
    letter: 'Y',
    image: 'https://images.unsplash.com/photo-1579165466741-7f35e4755183?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '95',
    name: 'Zika',
    description: 'Doença viral transmitida principalmente por mosquitos, que pode causar malformações congênitas em bebês de mães infectadas durante a gravidez.',
    symptoms: ['Febre leve', 'Erupção cutânea', 'Dor nas articulações', 'Conjuntivite', 'Dor de cabeça', 'Dor muscular'],
    treatments: ['Não há tratamento específico', 'Repouso', 'Hidratação', 'Analgésicos', 'Prevenção de picadas de mosquito'],
    letter: 'Z',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '96',
    name: 'Zoonose',
    description: 'Doenças infecciosas que podem ser transmitidas entre animais e humanos, como raiva, leptospirose ou doença de Lyme.',
    symptoms: ['Variam dependendo da doença específica', 'Febre', 'Fadiga', 'Dores musculares', 'Sintomas específicos da doença'],
    treatments: ['Tratamento específico para cada doença', 'Antibióticos', 'Antivirais', 'Vacinação preventiva', 'Controle de vetores'],
    letter: 'Z',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=300'
  }
];

// Alphabet array in correct order
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Icons for disease categories
const diseaseIcons: Record<string, React.ElementType> = {
  'A': Activity,
  'B': Thermometer,
  'C': Heart,
  'D': Pill,
  'E': Stethoscope,
  'F': Virus,
  'G': Info,
  'H': Heart,
  'I': Info,
  'J': Pill,
  'K': Virus,
  'L': Stethoscope,
  'M': Heart,
  'N': Thermometer,
  'O': Pill,
  'P': Activity,
  'Q': Info,
  'R': Virus,
  'S': Stethoscope,
  'T': Heart,
  'U': Thermometer,
  'V': Pill,
  'W': Activity,
  'X': Info,
  'Y': Virus,
  'Z': Stethoscope
};

const Diseases = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>(diseases);
  const [showLetterIntro, setShowLetterIntro] = useState(false);

  useEffect(() => {
    const filtered = diseases.filter(disease => {
      const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || disease.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
    setFilteredDiseases(filtered);
    
    // Show letter intro when a letter is selected and there are matching diseases
    setShowLetterIntro(!!selectedLetter && filtered.length > 0);
  }, [searchTerm, selectedLetter]);

  // Auto-select letter A on component mount
  useEffect(() => {
    setSelectedLetter('A');
  }, []);

  // Get the icon for the selected letter
  const LetterIcon = selectedLetter ? diseaseIcons[selectedLetter] || Info : Info;

  return (
    <div className="min-h-screen">
      <HeroParallax
        title="Doenças e Tratamentos"
        description="Encontre informações sobre diversas condições médicas"
        image="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=2000"
        typeSequence={[
          'Busque por Sintomas',
          2000,
          'Encontre Tratamentos',
          2000,
          'Entenda sua Saúde',
          2000
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar doenças..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 focus:border-verde-cia focus:ring-2 focus:ring-verde-cia/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {alphabet.map((letter) => (
              <motion.button
                key={letter}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  letter === selectedLetter
                    ? 'bg-verde-cia text-white'
                    : 'bg-white text-gray-600 hover:bg-verde-cia/10'
                }`}
              >
                {letter}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Letter Introduction Section */}
      {showLetterIntro && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 mb-8"
        >
          <div className="bg-gradient-to-r from-verde-cia to-verde-cia-escuro text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <LetterIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Doenças com a letra {selectedLetter}</h2>
                <p className="text-white/80">
                  Encontramos {filteredDiseases.length} {filteredDiseases.length === 1 ? 'doença' : 'doenças'} que {filteredDiseases.length === 1 ? 'começa' : 'começam'} com a letra {selectedLetter}
                </p>
              </div>
            </div>
            <p className="text-white/90">
              Explore informações detalhadas sobre sintomas, diagnósticos e tratamentos para cada condição.
              Lembre-se que estas informações são apenas educativas e não substituem a consulta médica.
            </p>
          </div>
        </motion.section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLetter + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredDiseases.map((disease) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-verde-cia">{disease.name}</h3>
                    <div className="w-8 h-8 bg-verde-cia text-white flex items-center justify-center font-bold text-lg rounded-full">
                      {disease.letter}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{disease.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 flex items-center text-gray-800">
                      <Activity className="w-4 h-4 mr-2 text-verde-cia" />
                      Sintomas:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {disease.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center text-gray-800">
                      <Pill className="w-4 h-4 mr-2 text-verde-cia" />
                      Tratamentos:
                    </h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {disease.treatments.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full bg-verde-cia text-white py-2 rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center justify-center"
                  >
                    <Info className="w-5 h-5 mr-2" />
                    Saiba mais
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredDiseases.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            <div className="bg-yellow-50 p-6 rounded-lg inline-block">
              <Info className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma doença encontrada</h3>
              <p>Não encontramos doenças que correspondam aos critérios selecionados.</p>
              <p className="mt-2">Tente selecionar outra letra ou modificar sua pesquisa.</p>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Diseases;