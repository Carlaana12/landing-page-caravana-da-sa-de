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
  const [selectedLetter, setSelectedLetter] = useState<string>('');
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
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Doenças e Tratamentos"
        description="Informações detalhadas sobre condições médicas e seus tratamentos"
        image="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Pesquise por Condições',
          2000,
          'Encontre Tratamentos',
          2000,
          'Informe-se sobre Sintomas',
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
                onClick={() => setSelectedLetter(letter === selectedLetter ? '' : letter)}
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
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Disease Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={disease.image || `https://source.unsplash.com/300x200/?medical,${disease.name.toLowerCase()}`} 
                    alt={disease.name} 
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-0 left-0 w-12 h-12 bg-verde-cia text-white flex items-center justify-center font-bold text-xl">
                    {disease.letter}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-verde-cia">{disease.name}</h3>
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