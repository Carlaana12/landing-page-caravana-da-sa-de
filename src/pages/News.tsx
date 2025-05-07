import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Calendar, User, Tag, ArrowRight, X } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';

const categories = ['Todas', 'Medicina', 'Pesquisa', 'Tecnologia', 'Saúde Pública', 'Bem-estar'];

const news = [
  {
    id: 1,
    title: 'Canabidiol (CBD) no Tratamento de Lúpus: Evidências e Perspectivas',
    excerpt: 'O canabidiol (CBD) tem despertado interesse como uma possível terapia complementar para o lúpus, apresentando propriedades anti-inflamatórias e imunomoduladoras que podem beneficiar pacientes.',
    content: `<h2>Canabidiol (CBD) no Tratamento de Lúpus: Evidências e Perspectivas</h2>
    <p>O lúpus eritematoso sistêmico (LES) é uma doença autoimune crônica que afeta diversos órgãos e tecidos do corpo, causando inflamação e dor. O tratamento convencional do lúpus geralmente envolve o uso de medicamentos imunossupressores e anti-inflamatórios, que podem ter efeitos colaterais significativos.</p>
    <p>Nos últimos anos, o canabidiol (CBD), um composto não psicoativo encontrado na planta Cannabis sativa, tem despertado interesse como uma possível terapia complementar para o lúpus. Estudos preliminares sugerem que o CBD pode ter propriedades anti-inflamatórias e imunomoduladoras, que poderiam ser benéficas para pacientes com lúpus.</p>
    
    <h3>Evidências Científicas</h3>
    <p>Algumas pesquisas indicam que o CBD pode ajudar a reduzir a atividade do sistema imunológico em pacientes com lúpus, diminuindo a produção de autoanticorpos e a inflamação. Além disso, o CBD pode aliviar a dor, a fadiga e outros sintomas comuns do lúpus.</p>
    <p>No entanto, é importante ressaltar que a maioria dos estudos sobre o uso de CBD no tratamento de lúpus ainda está em fase inicial, com amostras pequenas e metodologias variadas. Portanto, são necessários mais estudos clínicos randomizados e controlados para confirmar os benefícios e a segurança do CBD em pacientes com lúpus.</p>
    
    <h3>Como o CBD Atua no Lúpus?</h3>
    <p>O CBD interage com o sistema endocanabinoide, um complexo sistema de sinalização celular que desempenha um papel importante na regulação do sistema imunológico, da dor e da inflamação. Ao se ligar aos receptores canabinoides, o CBD pode modular a resposta imune e reduzir a inflamação em pacientes com lúpus.</p>
    
    <h3>Benefícios Potenciais do CBD no Lúpus</h3>
    <ul>
      <li><strong>Redução da inflamação:</strong> o CBD pode ajudar a diminuir a produção de citocinas pró-inflamatórias, que estão envolvidas na patogênese do lúpus.</li>
      <li><strong>Imunomodulação:</strong> o CBD pode regular a atividade do sistema imunológico, reduzindo a produção de autoanticorpos e a agressão às células e tecidos do próprio corpo.</li>
      <li><strong>Alívio da dor:</strong> o CBD pode atuar nos receptores da dor, diminuindo a percepção da dor e o desconforto em pacientes com lúpus.</li>
      <li><strong>Melhora da qualidade de vida:</strong> ao reduzir os sintomas do lúpus, o CBD pode contribuir para a melhora da qualidade de vida dos pacientes.</li>
    </ul>
    
    <h3>Riscos e Efeitos Colaterais</h3>
    <p>O CBD é geralmente considerado seguro, mas pode causar alguns efeitos colaterais, como sonolência, diarreia e alterações no apetite. Além disso, o CBD pode interagir com outros medicamentos, por isso é importante informar o médico sobre o uso de qualquer medicamento ou suplemento.</p>
    
    <h3>Importante</h3>
    <p>O uso de canabidiol (CBD) para o tratamento de lúpus ainda é considerado experimental e não substitui o tratamento convencional da doença. É fundamental consultar um médico reumatologista antes de iniciar o uso de CBD, para avaliar os riscos e benefícios individuais e garantir o acompanhamento adequado.</p>
    
    <h3>Considerações Finais</h3>
    <p>O canabidiol (CBD) apresenta-se como uma promissora terapia complementar para o lúpus, com potencial para reduzir a inflamação, modular o sistema imunológico e aliviar a dor. No entanto, são necessários mais estudos clínicos para confirmar os benefícios e a segurança do CBD em pacientes com lúpus. É crucial que os pacientes com lúpus conversem com seus médicos sobre o uso de CBD e sigam suas orientações.</p>
    
    <h3>Recursos Adicionais</h3>
    <ul>
      <li>Associação Brasileira de Pacientes de Lúpus (ABRAPL): <a href="https://lupus.org.br/site/" target="_blank">https://lupus.org.br/site/</a></li>
      <li>Sociedade Brasileira de Reumatologia: <a href="https://www.reumatologia.org.br/" target="_blank">https://www.reumatologia.org.br/</a></li>
    </ul>
    
    <h3>Onde Comprar Canabidiol (CBD) no Distrito Federal</h3>
    <p>No Distrito Federal, a compra de produtos à base de canabidiol (CBD) está sujeita à regulamentação da Agência Nacional de Vigilância Sanitária (Anvisa). Atualmente, a Anvisa permite a venda de medicamentos com CBD em farmácias e drogarias, desde que o produto tenha sido previamente aprovado pela agência e esteja em conformidade com as normas sanitárias.</p>
    <p>Além disso, algumas associações de pacientes e cooperativas podem oferecer produtos à base de CBD mediante prescrição médica. É importante verificar se a associação ou cooperativa está autorizada pela Anvisa a fornecer esses produtos.</p>
    
    <h4>Opções de Compra:</h4>
    <ul>
      <li><strong>Farmácias e drogarias:</strong> Consulte as farmácias e drogarias de sua região para verificar a disponibilidade de medicamentos com CBD aprovados pela Anvisa.</li>
      <li><strong>Associações de pacientes e cooperativas:</strong> Entre em contato com associações de pacientes e cooperativas que oferecem produtos à base de CBD para verificar a disponibilidade e os requisitos para compra.</li>
      <li><strong>Importação:</strong> Em alguns casos, é possível importar produtos com CBD mediante prescrição médica e autorização da Anvisa.</li>
    </ul>
    
    <h4>Informações Adicionais:</h4>
    <ul>
      <li>Anvisa: <a href="https://www.gov.br/anvisa/pt-br/" target="_blank">https://www.gov.br/anvisa/pt-br/</a></li>
      <li>Associação Brasileira de Pacientes de Lúpus (ABRAPL): <a href="https://lupus.org.br/site/" target="_blank">https://lupus.org.br/site/</a></li>
    </ul>
    
    <p><small><em>Aviso: Este artigo tem fins informativos e não substitui o aconselhamento médico profissional. Converse com seu médico sobre o uso de canabidiol (CBD).</em></small></p>`,
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-04-20',
    author: 'Anuário Saúde',
    category: 'Pesquisa',
    readTime: '8 min'
  },
  {
    id: 2,
    title: 'Avanços na Medicina Preventiva',
    excerpt: 'Novos estudos revelam a importância da prevenção na saúde a longo prazo...',
    content: 'Conteúdo completo da notícia...',
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-03-15',
    author: 'Anuário Saúde',
    category: 'Medicina',
    readTime: '5 min'
  },
  {
    id: 3,
    title: 'Inteligência Artificial na Saúde',
    excerpt: 'Como a IA está revolucionando diagnósticos e tratamentos médicos...',
    content: 'Conteúdo completo da notícia...',
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-03-14',
    author: 'Anuário Saúde',
    category: 'Tecnologia',
    readTime: '7 min'
  },
  {
    id: 4,
    title: 'Doenças Neurodegenerativas: Um Guia Abrangente',
    excerpt: 'Um panorama completo sobre as principais doenças neurodegenerativas, suas causas, sintomas, diagnóstico e tratamentos disponíveis atualmente.',
    content: `<h2>Doenças Neurodegenerativas: Um Guia Abrangente</h2>
    <p>As doenças neurodegenerativas representam um grupo heterogêneo de condições neurológicas que afetam progressivamente a estrutura e a função do sistema nervoso, levando à degeneração e morte de neurônios. Essa perda neuronal resulta em uma variedade de sintomas que podem incluir declínio cognitivo, problemas de movimento, dificuldades de linguagem e alterações comportamentais. Embora muitas doenças neurodegenerativas sejam associadas ao envelhecimento, algumas podem se manifestar em idades mais jovens. Atualmente, a maioria dessas doenças não tem cura, e o tratamento visa principalmente o alívio dos sintomas e a melhora da qualidade de vida dos pacientes.</p>
    
    <h3>O que são Doenças Neurodegenerativas?</h3>
    <p>Em termos simples, as doenças neurodegenerativas são caracterizadas pela perda progressiva de neurônios, as células especializadas que transmitem sinais elétricos e químicos no cérebro e no sistema nervoso. A morte dessas células leva à interrupção da comunicação entre diferentes regiões do cérebro e do corpo, resultando nos diversos sintomas associados a essas condições.</p>
    
    <h3>Principais Doenças Neurodegenerativas:</h3>
    <p>Existem diversas doenças neurodegenerativas, cada uma com características e sintomas específicos. Algumas das mais comuns incluem:</p>
    <ul>
      <li><strong>Doença de Alzheimer:</strong> A forma mais comum de demência, caracterizada por declínio progressivo da memória, pensamento, linguagem e comportamento. A presença de placas amiloides e emaranhados neurofibrilares no cérebro são características patológicas da doença.</li>
      <li><strong>Doença de Parkinson:</strong> Um distúrbio do movimento causado pela perda de neurônios produtores de dopamina na substância negra, uma região do cérebro envolvida no controle motor. Os sintomas incluem tremores, rigidez muscular, lentidão de movimentos (bradicinesia) e instabilidade postural.</li>
      <li><strong>Esclerose Lateral Amiotrófica (ELA):</strong> Uma doença progressiva que afeta os neurônios motores, as células nervosas que controlam os músculos voluntários. A ELA leva à fraqueza muscular progressiva, atrofia muscular, dificuldades de fala, deglutição e respiração.</li>
      <li><strong>Doença de Huntington:</strong> Uma doença genética hereditária que causa a degeneração de neurônios em certas áreas do cérebro, resultando em movimentos involuntários (coreia), alterações cognitivas e psiquiátricas.</li>
      <li><strong>Demência com Corpos de Lewy:</strong> Caracterizada pela presença de inclusões anormais de proteína (corpos de Lewy) nos neurônios. Os sintomas incluem flutuações na cognição, alucinações visuais, sintomas parkinsonianos e distúrbios do sono REM.</li>
      <li><strong>Ataxias Espinocerebelares:</strong> Um grupo de doenças genéticas que afetam o cerebelo, uma região do cérebro envolvida na coordenação e equilíbrio. Os sintomas incluem dificuldades de coordenação, marcha instável, problemas de fala e movimentos oculares anormais.</li>
    </ul>
    
    <h3>Causas e Fatores de Risco:</h3>
    <p>As causas exatas da maioria das doenças neurodegenerativas ainda não são totalmente compreendidas, mas acredita-se que uma combinação de fatores genéticos, ambientais e relacionados ao envelhecimento desempenham um papel crucial:</p>
    <ul>
      <li><strong>Fatores Genéticos:</strong> Mutações genéticas hereditárias podem aumentar significativamente o risco de desenvolver certas doenças neurodegenerativas, como a doença de Huntington e algumas formas de ELA e ataxia espinocerebelar.</li>
      <li><strong>Envelhecimento:</strong> O envelhecimento é o principal fator de risco para a maioria das doenças neurodegenerativas, como a doença de Alzheimer e a doença de Parkinson.</li>
      <li><strong>Fatores Ambientais:</strong> A exposição a toxinas ambientais, metais pesados, pesticidas e outros poluentes tem sido associada a um risco aumentado de algumas doenças neurodegenerativas.</li>
      <li><strong>Estilo de Vida:</strong> Fatores como dieta inadequada, falta de atividade física, tabagismo e consumo excessivo de álcool podem contribuir para o desenvolvimento de doenças neurodegenerativas.</li>
      <li><strong>Estresse Oxidativo:</strong> O desequilíbrio entre a produção de radicais livres e a capacidade do corpo de neutralizá-los pode danificar as células cerebrais e contribuir para a neurodegeneração.</li>
      <li><strong>Inflamação Crônica:</strong> A inflamação crônica no cérebro tem sido implicada no desenvolvimento de várias doenças neurodegenerativas.</li>
    </ul>
    
    <h3>Sintomas:</h3>
    <p>Os sintomas das doenças neurodegenerativas variam amplamente dependendo da doença específica e das áreas do cérebro afetadas. Alguns sintomas comuns incluem:</p>
    <ul>
      <li><strong>Declínio Cognitivo:</strong> Perda de memória, dificuldades de concentração, problemas de linguagem, dificuldade de raciocínio e julgamento.</li>
      <li><strong>Problemas de Movimento:</strong> Tremores, rigidez muscular, lentidão de movimentos, dificuldades de equilíbrio e coordenação.</li>
      <li><strong>Alterações Comportamentais e Psiquiátricas:</strong> Depressão, ansiedade, apatia, irritabilidade, alterações de humor e alucinações.</li>
      <li><strong>Dificuldades de Fala e Deglutição:</strong> Disartria (dificuldade de articular palavras) e disfagia (dificuldade de engolir).</li>
    </ul>
    
    <h3>Diagnóstico:</h3>
    <p>O diagnóstico das doenças neurodegenerativas geralmente envolve uma combinação de:</p>
    <ul>
      <li><strong>Histórico Médico Detalhado:</strong> Avaliação dos sintomas, histórico familiar e outros fatores relevantes.</li>
      <li><strong>Exame Neurológico:</strong> Avaliação das funções motoras, sensoriais, cognitivas e reflexas.</li>
      <li><strong>Testes Neuropsicológicos:</strong> Avaliação das funções cognitivas, como memória, atenção, linguagem e habilidades visuoespaciais.</li>
      <li><strong>Exames de Imagem Cerebral:</strong> Ressonância magnética (RM), tomografia computadorizada (TC) e PET scan podem ser usados para visualizar o cérebro e identificar alterações estruturais ou funcionais.</li>
      <li><strong>Exames Laboratoriais:</strong> Exames de sangue e outros fluidos corporais podem ser usados para descartar outras condições e, em alguns casos, identificar marcadores biológicos associados a certas doenças neurodegenerativas.</li>
      <li><strong>Testes Genéticos:</strong> Podem ser realizados para identificar mutações genéticas associadas a algumas doenças neurodegenerativas hereditárias.</li>
    </ul>
    
    <h3>Tratamento:</h3>
    <p>Atualmente, não há cura para a maioria das doenças neurodegenerativas. O tratamento visa principalmente:</p>
    <ul>
      <li><strong>Aliviar os Sintomas:</strong> Medicamentos podem ser usados para controlar tremores, rigidez muscular, depressão, ansiedade e outros sintomas.</li>
      <li><strong>Retardar a Progressão da Doença:</strong> Alguns medicamentos podem ajudar a retardar a progressão de certas doenças, como a doença de Alzheimer.</li>
      <li><strong>Melhorar a Qualidade de Vida:</strong> Terapias como fisioterapia, terapia ocupacional, fonoaudiologia e terapia cognitivo-comportamental podem ajudar os pacientes a manter a independência e a qualidade de vida.</li>
      <li><strong>Apoio Psicossocial:</strong> O apoio emocional e social é fundamental para os pacientes e seus familiares.</li>
    </ul>
    
    <h3>Pesquisa e Avanços:</h3>
    <p>A pesquisa sobre doenças neurodegenerativas está em constante evolução, com o objetivo de entender melhor as causas dessas doenças, desenvolver novos tratamentos e, eventualmente, encontrar curas. Áreas promissoras de pesquisa incluem:</p>
    <ul>
      <li><strong>Terapias Genéticas:</strong> Visando corrigir ou modular genes defeituosos.</li>
      <li><strong>Imunoterapia:</strong> Estimulando o sistema imunológico a combater a neurodegeneração.</li>
      <li><strong>Terapias com Células-Tronco:</strong> Visando substituir neurônios danificados.</li>
      <li><strong>Desenvolvimento de Biomarcadores:</strong> Para diagnóstico precoce e monitoramento da progressão da doença.</li>
    </ul>
    
    <h3>Conclusão:</h3>
    <p>As doenças neurodegenerativas representam um desafio significativo para a saúde pública, afetando milhões de pessoas em todo o mundo. Embora a maioria dessas doenças ainda não tenha cura, a pesquisa contínua e os avanços na compreensão dos mecanismos envolvidos na neurodegeneração oferecem esperança para o desenvolvimento de tratamentos mais eficazes no futuro. O diagnóstico precoce, o tratamento adequado e o apoio psicossocial são fundamentais para melhorar a qualidade de vida dos pacientes e seus familiares.</p>
    
    <p><small><em>Aviso: Este artigo tem fins informativos e não substitui o aconselhamento médico profissional. Se você suspeita de uma doença neurodegenerativa, consulte um neurologista para diagnóstico e tratamento adequados.</em></small></p>`,
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-04-15',
    author: 'Anuário Saúde',
    category: 'Medicina',
    readTime: '10 min'
  },
  {
    id: 5,
    title: 'Medicina Preventiva: A Chave para uma Vida Saudável',
    excerpt: 'Descubra como a medicina preventiva pode transformar sua saúde e reduzir riscos de doenças através de hábitos diários, exames regulares e abordagens proativas.',
    content: `<h2>Medicina Preventiva: A Chave para uma Vida Saudável</h2>
    <p>A medicina preventiva representa uma abordagem proativa para cuidados de saúde, concentrando-se na prevenção de doenças em vez do tratamento após o surgimento dos sintomas. Este paradigma de saúde enfatiza a importância de manter um estilo de vida saudável, realizar exames de rotina, identificar fatores de risco e tomar medidas preventivas para evitar problemas de saúde. Em um mundo onde doenças crônicas não transmissíveis como diabetes, doenças cardíacas e câncer estão em ascensão, a medicina preventiva surge como uma estratégia fundamental para melhorar a saúde pública e reduzir os custos com cuidados médicos.</p>
    
    <h3>Princípios Fundamentais da Medicina Preventiva</h3>
    <p>A medicina preventiva é tradicionalmente categorizada em três níveis:</p>
    <ul>
      <li><strong>Prevenção Primária:</strong> Visa evitar o desenvolvimento inicial de uma doença. Exemplos incluem vacinação, educação sobre estilo de vida saudável e redução da exposição a fatores de risco conhecidos.</li>
      <li><strong>Prevenção Secundária:</strong> Concentra-se na detecção precoce de doenças, quando o tratamento pode ser mais eficaz e menos invasivo. Exemplos incluem exames de rastreamento como mamografias, colonoscopias e exames de pressão arterial.</li>
      <li><strong>Prevenção Terciária:</strong> Tem como objetivo reduzir o impacto de uma doença já estabelecida, limitando complicações e melhorando a qualidade de vida. Exemplos incluem programas de reabilitação após um derrame ou gerenciamento de condições crônicas como diabetes.</li>
    </ul>
    
    <h3>Componentes Essenciais de um Programa de Medicina Preventiva</h3>
    <p>Um programa abrangente de medicina preventiva geralmente inclui os seguintes componentes:</p>
    
    <h4>1. Avaliação Regular de Saúde</h4>
    <p>Consultas médicas regulares permitem a avaliação contínua do estado de saúde e a identificação precoce de potenciais problemas. Estas avaliações geralmente incluem:</p>
    <ul>
      <li>Histórico médico completo</li>
      <li>Exame físico</li>
      <li>Avaliação de sinais vitais (pressão arterial, frequência cardíaca, temperatura)</li>
      <li>Análise de índices como IMC (Índice de Massa Corporal)</li>
      <li>Exames laboratoriais de rotina (hemograma completo, perfil lipídico, glicemia)</li>
    </ul>
    
    <h4>2. Imunizações</h4>
    <p>As vacinas são uma das intervenções preventivas mais eficazes na história da medicina. Um programa de imunização atualizado é essencial para todas as faixas etárias, não apenas para crianças.</p>
    
    <h4>3. Rastreamento de Doenças</h4>
    <p>Exames de rastreamento são realizados para detectar doenças em estágios iniciais, muitas vezes antes do aparecimento de sintomas. Alguns exemplos importantes incluem:</p>
    <ul>
      <li>Câncer: mamografia, colonoscopia, exame de Papanicolau, PSA para câncer de próstata</li>
      <li>Doenças cardiovasculares: monitoramento da pressão arterial, colesterol</li>
      <li>Diabetes: teste de glicemia de jejum ou hemoglobina glicada</li>
      <li>Osteoporose: densitometria óssea</li>
      <li>Doenças oculares: exames oftalmológicos</li>
      <li>Saúde bucal: exames odontológicos regulares</li>
    </ul>
    
    <h4>4. Aconselhamento sobre Estilo de Vida</h4>
    <p>O aconselhamento sobre fatores de estilo de vida é fundamental para prevenir muitas doenças crônicas. Áreas de foco incluem:</p>
    <ul>
      <li><strong>Nutrição:</strong> Orientação sobre dieta equilibrada, controle de porções, redução de sódio e açúcar</li>
      <li><strong>Atividade física:</strong> Recomendações para exercício regular adaptado às necessidades individuais</li>
      <li><strong>Gerenciamento do peso:</strong> Estratégias para manter um peso saudável</li>
      <li><strong>Cessação do tabagismo:</strong> Apoio para parar de fumar</li>
      <li><strong>Consumo moderado de álcool:</strong> Orientações sobre limites seguros</li>
      <li><strong>Gerenciamento do estresse:</strong> Técnicas de relaxamento e equilíbrio entre vida profissional e pessoal</li>
      <li><strong>Sono adequado:</strong> Importância do sono de qualidade para a saúde geral</li>
    </ul>
    
    <h4>5. Avaliação e Redução de Riscos Ambientais e Ocupacionais</h4>
    <p>Identificação e minimização da exposição a fatores de risco no ambiente doméstico, comunitário e de trabalho.</p>
    
    <h3>Benefícios da Medicina Preventiva</h3>
    <p>A adoção de uma abordagem preventiva à saúde oferece numerosos benefícios:</p>
    <ul>
      <li><strong>Redução da morbidade e mortalidade:</strong> Prevenção ou detecção precoce de doenças leva a melhores resultados de saúde</li>
      <li><strong>Melhoria da qualidade de vida:</strong> Manutenção da saúde e funcionalidade por mais tempo</li>
      <li><strong>Redução de custos com saúde:</strong> Prevenir doenças geralmente custa menos do que tratá-las</li>
      <li><strong>Aumento da produtividade:</strong> Menos dias perdidos por doença</li>
      <li><strong>Empoderamento individual:</strong> Maior controle sobre a própria saúde e bem-estar</li>
    </ul>
    
    <h3>Desafios na Implementação da Medicina Preventiva</h3>
    <p>Apesar dos benefícios claros, existem desafios na implementação efetiva de práticas de medicina preventiva:</p>
    <ul>
      <li><strong>Barreiras de acesso:</strong> Desigualdades socioeconômicas podem limitar o acesso a serviços preventivos</li>
      <li><strong>Falta de conhecimento:</strong> Muitas pessoas não estão cientes da importância da prevenção</li>
      <li><strong>Resistência à mudança de comportamento:</strong> Dificuldade em modificar hábitos de longa data</li>
      <li><strong>Foco do sistema de saúde no tratamento:</strong> Muitos sistemas de saúde ainda priorizam o tratamento sobre a prevenção</li>
      <li><strong>Limitações de tempo nas consultas médicas:</strong> Consultas breves podem não permitir aconselhamento preventivo adequado</li>
    </ul>
    
    <h3>Estratégias para Incorporar a Medicina Preventiva no Cotidiano</h3>
    <p>Aqui estão algumas estratégias práticas para incorporar princípios de medicina preventiva na vida diária:</p>
    <ul>
      <li><strong>Criar um calendário de saúde:</strong> Agendar consultas regulares e exames de rastreamento conforme recomendado para sua idade, sexo e perfil de risco</li>
      <li><strong>Manter registros de saúde:</strong> Documentar histórico médico, medicamentos, alergias e resultados de exames</li>
      <li><strong>Adotar uma dieta equilibrada:</strong> Priorizar frutas, vegetais, grãos integrais, proteínas magras e limitar alimentos processados</li>
      <li><strong>Exercitar-se regularmente:</strong> Buscar pelo menos 150 minutos de atividade física moderada por semana</li>
      <li><strong>Gerenciar o estresse:</strong> Praticar técnicas de relaxamento como meditação, yoga ou respiração profunda</li>
      <li><strong>Obter sono adequado:</strong> Priorizar 7-9 horas de sono de qualidade por noite</li>
      <li><strong>Evitar substâncias nocivas:</strong> Não fumar, limitar o consumo de álcool e evitar drogas ilícitas</li>
      <li><strong>Manter-se informado:</strong> Buscar informações confiáveis sobre saúde e prevenção de doenças</li>
    </ul>
    
    <h3>O Futuro da Medicina Preventiva</h3>
    <p>O campo da medicina preventiva está evoluindo rapidamente com avanços tecnológicos e científicos:</p>
    <ul>
      <li><strong>Medicina personalizada:</strong> Intervenções preventivas adaptadas ao perfil genético individual</li>
      <li><strong>Tecnologias vestíveis (wearables):</strong> Dispositivos que monitoram continuamente indicadores de saúde</li>
      <li><strong>Telemedicina:</strong> Ampliação do acesso a consultas preventivas</li>
      <li><strong>Inteligência artificial:</strong> Análise de grandes volumes de dados para identificar padrões e fatores de risco</li>
      <li><strong>Mudanças na política de saúde:</strong> Maior ênfase em programas de prevenção e promoção da saúde</li>
    </ul>
    
    <h3>Conclusão</h3>
    <p>A medicina preventiva oferece uma abordagem proativa e eficaz para manter e melhorar a saúde, reduzindo significativamente o risco de desenvolver diversas doenças crônicas. Ao incorporar princípios preventivos em políticas de saúde pública e práticas individuais, podemos construir uma sociedade mais saudável e reduzir a carga de doenças evitáveis. A verdadeira promessa da medicina preventiva reside em sua capacidade de transformar vidas, promovendo não apenas a ausência de doença, mas um estado de bem-estar físico, mental e social completo.</p>
    
    <p><small><em>Aviso: Este artigo tem fins informativos e não substitui o aconselhamento médico profissional. Consulte sempre um profissional de saúde para orientações específicas sobre sua saúde.</em></small></p>`,
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-05-01',
    author: 'Anuário Saúde',
    category: 'Saúde Preventiva',
    readTime: '12 min'
  },
  {
    id: 6,
    title: 'Telemedicina: Transformando o Acesso à Saúde',
    excerpt: 'Uma análise sobre como a telemedicina está revolucionando o acesso aos serviços de saúde, especialmente em regiões remotas, e seu impacto na qualidade do atendimento médico.',
    content: `<h2>Telemedicina: Transformando o Acesso à Saúde</h2>
    <p>A telemedicina representa uma revolução na forma como os serviços de saúde são prestados, utilizando tecnologias de informação e comunicação para proporcionar assistência médica à distância. Esta modalidade de atendimento tem ganhado destaque nos últimos anos, especialmente após a pandemia de COVID-19, que acelerou significativamente sua adoção em todo o mundo. Mais do que uma tendência temporária, a telemedicina está se consolidando como um componente permanente e transformador dos sistemas de saúde modernos.</p>
    
    <h3>O Que é Telemedicina?</h3>
    <p>A telemedicina envolve o uso de tecnologias digitais para fornecer serviços de saúde remotamente. Isso inclui consultas por vídeo, monitoramento remoto de pacientes, compartilhamento digital de exames e resultados, e até mesmo procedimentos médicos realizados à distância com o auxílio de tecnologias robóticas. O objetivo principal é melhorar o acesso aos cuidados de saúde, reduzir custos e aumentar a eficiência dos serviços médicos.</p>
    
    <h3>Modalidades da Telemedicina</h3>
    <p>A telemedicina pode ser categorizada em diferentes modalidades, cada uma destinada a atender necessidades específicas:</p>
    <ul>
      <li><strong>Teleconsulta:</strong> Consultas médicas realizadas remotamente através de videoconferência, permitindo interação em tempo real entre médico e paciente.</li>
      <li><strong>Telemonitoramento:</strong> Acompanhamento remoto de parâmetros vitais e condições de saúde do paciente, especialmente útil para doenças crônicas como diabetes e hipertensão.</li>
      <li><strong>Teleinterconsulta:</strong> Comunicação entre profissionais de saúde para discussão de casos clínicos, permitindo a colaboração e segunda opinião de especialistas.</li>
      <li><strong>Telelaudo:</strong> Interpretação remota de exames médicos, como radiografias, tomografias e ressonâncias magnéticas.</li>
      <li><strong>Telecirurgia:</strong> Realização de procedimentos cirúrgicos à distância com o auxílio de tecnologias robóticas avançadas, ainda em fase experimental e não amplamente disponível.</li>
    </ul>
    
    <h3>Benefícios da Telemedicina</h3>
    <h4>Ampliação do Acesso à Saúde</h4>
    <p>Um dos principais benefícios da telemedicina é a ampliação do acesso aos serviços de saúde, especialmente para populações que enfrentam barreiras geográficas, sociais ou econômicas:</p>
    <ul>
      <li><strong>Regiões Remotas e Rurais:</strong> Comunidades distantes de centros médicos especializados podem acessar cuidados de saúde sem a necessidade de longos deslocamentos.</li>
      <li><strong>Pessoas com Mobilidade Reduzida:</strong> Idosos, pessoas com deficiência ou condições que limitam a mobilidade podem receber atendimento sem sair de casa.</li>
      <li><strong>Áreas com Escassez de Profissionais:</strong> Regiões com poucos médicos especialistas podem se beneficiar de consultas remotas com profissionais de outras localidades.</li>
    </ul>
    
    <h4>Eficiência e Redução de Custos</h4>
    <p>A telemedicina pode contribuir para a otimização dos recursos de saúde e redução de custos:</p>
    <ul>
      <li><strong>Diminuição de Deslocamentos:</strong> Redução de gastos com transporte para pacientes e acompanhantes.</li>
      <li><strong>Prevenção de Complicações:</strong> O monitoramento remoto de pacientes crônicos pode permitir intervenções precoces, evitando agravamentos e hospitalizações.</li>
      <li><strong>Otimização do Tempo:</strong> Redução do tempo de espera e maior eficiência no atendimento de casos de menor complexidade.</li>
      <li><strong>Desafogamento de Serviços Presenciais:</strong> Redução da sobrecarga em unidades de pronto atendimento e ambulatórios para casos que podem ser resolvidos remotamente.</li>
    </ul>
    
    <h4>Melhoria da Qualidade do Atendimento</h4>
    <p>Além do acesso e da redução de custos, a telemedicina pode contribuir para a melhoria da qualidade do atendimento:</p>
    <ul>
      <li><strong>Continuidade do Cuidado:</strong> Facilita o acompanhamento regular de pacientes com doenças crônicas.</li>
      <li><strong>Acesso a Especialistas:</strong> Permite consultas com médicos especialistas que não estariam disponíveis localmente.</li>
      <li><strong>Integração de Dados:</strong> Sistemas de telemedicina avançados permitem a integração de prontuários eletrônicos, facilitando o acesso a histórico médico completo.</li>
      <li><strong>Redução de Exposição a Infecções:</strong> Diminui a necessidade de deslocamento a ambientes hospitalares, reduzindo o risco de infecções hospitalares.</li>
    </ul>
    
    <h3>Desafios e Limitações</h3>
    <p>Apesar dos inúmeros benefícios, a telemedicina ainda enfrenta desafios significativos:</p>
    
    <h4>Desafios Tecnológicos</h4>
    <ul>
      <li><strong>Exclusão Digital:</strong> Acesso limitado à internet e dispositivos tecnológicos em comunidades vulneráveis pode aumentar disparidades em saúde.</li>
      <li><strong>Segurança e Privacidade:</strong> Necessidade de garantir a proteção de dados sensíveis de saúde contra violações de privacidade e ataques cibernéticos.</li>
      <li><strong>Infraestrutura Adequada:</strong> Exigência de conexões estáveis e rápidas para consultas por vídeo de qualidade, nem sempre disponíveis em todas as regiões.</li>
    </ul>
    
    <h4>Limitações Clínicas</h4>
    <ul>
      <li><strong>Exame Físico Limitado:</strong> Impossibilidade de realizar certos aspectos do exame físico, necessários para diagnósticos precisos de algumas condições.</li>
      <li><strong>Restrições para Certas Especialidades:</strong> Algumas áreas médicas, como cirurgia e dermatologia, podem ter limitações significativas no atendimento remoto.</li>
      <li><strong>Emergências Médicas:</strong> Inadequação para situações de emergência que requerem intervenção imediata e presencial.</li>
    </ul>
    
    <h4>Desafios Regulatórios e Éticos</h4>
    <ul>
      <li><strong>Regulamentação em Evolução:</strong> Normas e legislações sobre telemedicina ainda estão em desenvolvimento em muitos países.</li>
      <li><strong>Licenciamento Médico:</strong> Questões relacionadas ao atendimento através de fronteiras estaduais ou nacionais, onde os médicos podem não ter licença para atuar.</li>
      <li><strong>Responsabilidade Profissional:</strong> Definição clara de responsabilidades em casos de erros ou omissões em atendimentos remotos.</li>
    </ul>
    
    <h3>A Telemedicina no Brasil</h3>
    <p>No Brasil, a telemedicina ganhou impulso significativo durante a pandemia de COVID-19. Em 2020, o Conselho Federal de Medicina (CFM) autorizou, em caráter excepcional, a teleorientação, telemonitoramento e teleconsulta. Posteriormente, a Lei nº 13.989/2020 regulamentou o uso da telemedicina durante a crise sanitária.</p>
    
    <p>Após este período inicial, novas regulamentações foram estabelecidas para normatizar a prática da telemedicina no país, incluindo a necessidade de primeiro atendimento presencial antes de consultas de acompanhamento remotas, com exceções para determinadas situações.</p>
    
    <p>O Sistema Único de Saúde (SUS) também tem implementado iniciativas de telemedicina, como o Programa Telessaúde Brasil Redes, que visa melhorar a qualidade do atendimento na atenção primária, oferecendo suporte aos profissionais de saúde através de teleconsultorias e teleconsultas.</p>
    
    <h3>O Futuro da Telemedicina</h3>
    <p>O futuro da telemedicina promete expansões significativas com o avanço tecnológico:</p>
    
    <h4>Integração com Outras Tecnologias</h4>
    <ul>
      <li><strong>Inteligência Artificial:</strong> Algoritmos de IA para auxiliar no diagnóstico, triagem de pacientes e análise de exames.</li>
      <li><strong>Internet das Coisas Médicas (IoMT):</strong> Dispositivos vestíveis e sensores conectados que monitoram parâmetros vitais e enviam dados automaticamente para análise médica.</li>
      <li><strong>Realidade Virtual e Aumentada:</strong> Ferramentas que permitem simulações de procedimentos e treinamentos médicos à distância.</li>
    </ul>
    
    <h4>Evolução dos Modelos de Atendimento</h4>
    <ul>
      <li><strong>Modelos Híbridos:</strong> Combinação de atendimentos presenciais e remotos, otimizando a experiência do paciente.</li>
      <li><strong>Plataformas Integradas:</strong> Sistemas que unificam telemedicina, prontuários eletrônicos, agendamentos e prescrições digitais.</li>
      <li><strong>Telemedicina Preventiva:</strong> Foco crescente na prevenção de doenças e promoção da saúde, não apenas no tratamento.</li>
    </ul>
    
    <h3>Conclusão</h3>
    <p>A telemedicina representa uma transformação profunda na prestação de serviços de saúde, oferecendo soluções para desafios históricos de acesso, eficiência e qualidade. Embora não substitua completamente o atendimento presencial, a telemedicina complementa o sistema de saúde tradicional, criando um modelo mais flexível, inclusivo e centrado no paciente.</p>
    
    <p>À medida que a tecnologia avança e as barreiras regulatórias são superadas, a telemedicina tende a se tornar cada vez mais integrada ao cotidiano dos serviços de saúde. O desafio para os próximos anos será garantir que essa evolução ocorra de forma equitativa, assegurando que todos os segmentos da população possam se beneficiar dos avanços tecnológicos na área da saúde.</p>
    
    <p>Para os pacientes, profissionais de saúde e gestores, compreender as possibilidades e limitações da telemedicina é fundamental para utilizá-la de forma eficaz, aproveitando ao máximo seu potencial transformador para a saúde individual e coletiva.</p>
    
    <p><small><em>Aviso: Este artigo tem fins informativos e não substitui o aconselhamento médico profissional. Consulte sempre um profissional de saúde para orientações específicas sobre sua saúde.</em></small></p>`,
    image: 'https://i.imgur.com/OimSbSx.gif',
    date: '2024-05-10',
    author: 'Anuário Saúde',
    category: 'Tecnologia',
    readTime: '12 min'
  },
  // Add more news items...
];

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<null | typeof news[0]>(null);

  const filteredNews = news.filter(item => {
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <HeroParallax
        title="Notícias e Atualizações"
        description="Fique por dentro das últimas notícias e novidades do mundo da saúde"
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Notícias da Saúde',
          2000,
          'Descobertas Médicas',
          2000,
          'Atualizações do Setor',
          2000
        ]}
      />

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-verde-cia text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredNews.map((item) => (
              <motion.article
                key={item.id}
                layout
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(item.date), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {item.author}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <button 
                      className="text-verde-cia hover:text-verde-cia-escuro font-medium flex items-center transition-colors"
                      onClick={() => setSelectedArticle(item)}
                    >
                      Ler mais
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500">{item.readTime} de leitura</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-12"
          >
            Nenhuma notícia encontrada com os critérios selecionados.
          </motion.div>
        )}
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(selectedArticle.date), 'dd MMM yyyy', { locale: ptBR })}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedArticle.author}
                    </span>
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {selectedArticle.category}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setSelectedArticle(null)}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="prose prose-verde-cia max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;