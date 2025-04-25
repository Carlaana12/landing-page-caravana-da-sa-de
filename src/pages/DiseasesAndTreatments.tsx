import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowRight, Info } from 'lucide-react';

interface Disease {
  name: string;
  description: string;
  symptoms: string;
  treatments: string;
  prevention: string;
}

const diseasesByLetter: Record<string, Disease[]> = {
  A: [
    {
      name: "Acne",
      description: "Doença de pele que ocorre quando os folículos pilosos ficam obstruídos por óleo e células mortas da pele, causando cravos e espinhas.",
      symptoms: "Cravos, espinhas, nódulos e cistos na pele, especialmente no rosto, costas, peito e ombros.",
      treatments: "Lavagem suave da pele, medicamentos tópicos, antibióticos orais, isotretinoína em casos graves.",
      prevention: "Higiene adequada da pele, evitar produtos oleosos, dieta balanceada, não espremer espinhas."
    },
    {
      name: "Alergia",
      description: "Reação exagerada do sistema imunológico a substâncias normalmente inofensivas.",
      symptoms: "Espirros, coriza, coceira nos olhos, nariz e garganta, erupções cutâneas, falta de ar.",
      treatments: "Anti-histamínicos, descongestionantes, corticosteroides, imunoterapia.",
      prevention: "Evitar alérgenos conhecidos, manter ambiente limpo, usar filtros de ar."
    },
    {
      name: "Anemia",
      description: "Condição em que há redução da quantidade de glóbulos vermelhos ou hemoglobina no sangue.",
      symptoms: "Fadiga, fraqueza, palidez, tontura, falta de ar, palpitações.",
      treatments: "Suplementação de ferro, vitamina B12 ou ácido fólico, transfusão de sangue em casos graves.",
      prevention: "Dieta rica em ferro, vitamina B12 e ácido fólico, tratamento de doenças subjacentes."
    },
    {
      name: "Artrite",
      description: "Inflamação das articulações que causa dor e rigidez.",
      symptoms: "Dor nas articulações, rigidez, inchaço, vermelhidão, redução da amplitude de movimento.",
      treatments: "Medicamentos anti-inflamatórios, fisioterapia, exercícios, em casos graves, cirurgia.",
      prevention: "Manter peso saudável, exercícios regulares, evitar lesões nas articulações."
    },
    {
      name: "Asma",
      description: "Doença inflamatória crônica das vias aéreas que causa dificuldade para respirar.",
      symptoms: "Falta de ar, chiado no peito, tosse, aperto no peito, especialmente à noite ou pela manhã.",
      treatments: "Broncodilatadores, corticosteroides inalatórios, controle de alérgenos.",
      prevention: "Evitar gatilhos como fumaça, poeira, pólen, manter ambiente limpo, não fumar."
    },
    {
      name: "Autismo",
      description: "Transtorno do desenvolvimento que afeta a comunicação e interação social.",
      symptoms: "Dificuldade de comunicação, comportamentos repetitivos, interesses restritos, sensibilidade sensorial.",
      treatments: "Terapia comportamental, fonoaudiologia, terapia ocupacional, educação especializada.",
      prevention: "Não há prevenção conhecida, mas diagnóstico e intervenção precoces são essenciais."
    },
    {
      name: "AIDS",
      description: "Síndrome da Imunodeficiência Adquirida causada pelo vírus HIV.",
      symptoms: "Febre, fadiga, perda de peso, infecções oportunistas, suores noturnos.",
      treatments: "Terapia antirretroviral (TARV), tratamento de infecções oportunistas.",
      prevention: "Uso de preservativos, não compartilhar agulhas, testagem regular."
    },
    {
      name: "Alzheimer",
      description: "Doença neurodegenerativa que causa perda progressiva de memória e funções cognitivas.",
      symptoms: "Perda de memória, confusão, dificuldade de raciocínio, mudanças de personalidade.",
      treatments: "Medicamentos para retardar a progressão, terapia cognitiva, suporte familiar.",
      prevention: "Exercícios mentais, dieta saudável, atividade física, controle de fatores de risco cardiovascular."
    },
    {
      name: "Amigdalite",
      description: "Inflamação das amígdalas, geralmente causada por infecção viral ou bacteriana.",
      symptoms: "Dor de garganta, dificuldade para engolir, febre, inchaço dos gânglios linfáticos.",
      treatments: "Antibióticos (se bacteriana), analgésicos, gargarejos com água morna e sal.",
      prevention: "Boa higiene, evitar contato com pessoas infectadas, fortalecer sistema imunológico."
    },
    {
      name: "Anorexia",
      description: "Transtorno alimentar caracterizado por restrição extrema de alimentos e medo intenso de ganhar peso.",
      symptoms: "Perda de peso extrema, medo de engordar, distorção da imagem corporal, amenorreia.",
      treatments: "Terapia nutricional, psicoterapia, medicamentos para ansiedade e depressão.",
      prevention: "Promoção de autoestima saudável, educação sobre alimentação, detecção precoce."
    },
    {
      name: "Ansiedade",
      description: "Transtorno caracterizado por preocupação excessiva e medo intenso.",
      symptoms: "Preocupação constante, tensão muscular, insônia, palpitações, sudorese.",
      treatments: "Terapia cognitivo-comportamental, medicamentos ansiolíticos, técnicas de relaxamento.",
      prevention: "Exercícios regulares, técnicas de gerenciamento de estresse, sono adequado."
    },
    {
      name: "Artrite Reumatoide",
      description: "Doença autoimune que causa inflamação crônica das articulações.",
      symptoms: "Dor e rigidez nas articulações, fadiga, febre baixa, deformidades articulares.",
      treatments: "Medicamentos imunossupressores, anti-inflamatórios, fisioterapia.",
      prevention: "Não há prevenção conhecida, mas diagnóstico precoce pode retardar progressão."
    },
    {
      name: "Aterosclerose",
      description: "Acúmulo de placas de gordura nas artérias, levando ao estreitamento e endurecimento.",
      symptoms: "Dor no peito, falta de ar, fadiga, em casos graves, infarto ou AVC.",
      treatments: "Mudanças no estilo de vida, medicamentos para colesterol, pressão arterial e diabetes.",
      prevention: "Dieta saudável, exercícios, não fumar, controle de pressão arterial e colesterol."
    },
    {
      name: "Afta",
      description: "Lesão ulcerada na mucosa bucal, geralmente dolorosa.",
      symptoms: "Ferida arredondada, branca ou amarelada, com borda vermelha, dor local.",
      treatments: "Analgésicos tópicos, enxaguantes bucais, pomadas cicatrizantes.",
      prevention: "Higiene bucal adequada, evitar alimentos ácidos ou muito condimentados."
    },
    {
      name: "Apneia do Sono",
      description: "Interrupção temporária da respiração durante o sono.",
      symptoms: "Ronco alto, sonolência diurna, dor de cabeça matinal, dificuldade de concentração.",
      treatments: "CPAP, mudanças no estilo de vida, cirurgia em alguns casos.",
      prevention: "Manter peso saudável, evitar álcool e sedativos, dormir de lado."
    }
  ],
  // ... rest of the existing letters ...
}

const DiseasesAndTreatments: React.FC = () => {
  // ... state e funções ...

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Wrapper para o Hero */}
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Doenças e Tratamentos</h1>
          <p className="text-lg md:text-xl text-cyan-100 max-w-3xl mx-auto">
            Encontre informações detalhadas sobre diversas condições de saúde e suas opções de tratamento.
          </p>
        </div>
      </div>

       {/* Conteúdo restante DENTRO do container padrão */}
      <div className="max-w-7xl mx-auto px-4 py-16">
         {/* ... lista de doenças ... */}
      </div>
    </div>
  );
};

export default DiseasesAndTreatments; 