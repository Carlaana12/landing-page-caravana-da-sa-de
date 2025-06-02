import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const faqsMock = [
  {
    question: 'Como posso encontrar um médico especialista?',
    answer: 'Você pode usar nossa ferramenta de busca na página "Encontre Aqui", filtrando por especialidade, localização ou nome do profissional. Também é possível ver avaliações e informações detalhadas sobre cada especialista.'
  },
  {
    question: 'Como funciona o agendamento de consultas?',
    answer: 'Após encontrar o profissional desejado, você pode clicar em "Agendar Consulta" no perfil do médico. Selecione a data e horário disponíveis e confirme seu agendamento. Você receberá uma confirmação por e-mail.'
  },
  {
    question: 'O que são teleconsultas?',
    answer: 'Teleconsultas são consultas médicas realizadas remotamente, por videoconferência. Elas permitem que você receba atendimento médico sem sair de casa, usando seu computador, tablet ou smartphone.'
  },
  {
    question: 'Como posso me cadastrar como profissional de saúde?',
    answer: 'Para se cadastrar como profissional, acesse a opção "Portal Profissional" no menu superior e clique em "Criar nova conta". Preencha o formulário com suas informações profissionais e envie a documentação necessária para verificação.'
  },
  {
    question: 'Os serviços do Anuário de Saúde são gratuitos?',
    answer: 'A busca por profissionais e o acesso às informações são gratuitos para os pacientes. Para os profissionais de saúde, oferecemos planos com diferentes benefícios e funcionalidades.'
  },
  {
    question: 'Como posso entrar em contato com o suporte?',
    answer: 'Você pode entrar em contato conosco através da página "Fale Conosco", pelo e-mail ciacomunicacaointegrada@gmail.com ou pelo telefone (61) 98192-6686.'
  }
];

const FAQSection: React.FC = () => {
  const [faqsData, setFaqsData] = useState<any[]>([]);
  const faqsToShow = faqsData.length > 0 ? faqsData : faqsMock;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      console.log('[FAQSection] Iniciando busca de FAQs do Supabase...');
      const { data, error } = await supabase
        .from('admin_faq')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) {
        console.error('[FAQSection] Erro ao buscar FAQs:', error);
        setFaqsData([]); // Garante fallback para mock em caso de erro
      } else if (data && data.length > 0) {
        console.log('[FAQSection] FAQs recebidos do Supabase (total:', data.length, '):', data);
        if (data[0]) {
             console.log('[FAQSection] Estrutura do PRIMEIRO FAQ ORIGINAL:', JSON.stringify(data[0], null, 2));
        }
        
        // Transformar os dados para corresponder à estrutura esperada pelo componente
        const transformedFaqs = data.map(faq => ({
          id: faq.id, // Manter o id original
          question: faq.pergunta || '', // Mapear pergunta para question
          answer: faq.resposta || '',   // Mapear resposta para answer
          ordem: faq.ordem, // Manter ordem se usado para alguma lógica interna ou futura
          created_at: faq.created_at // Manter created_at
        }));

        console.log('[FAQSection] FAQs TRANSFORMADOS:', transformedFaqs);
        if (transformedFaqs.length > 0 && transformedFaqs[0]) {
            console.log('[FAQSection] Estrutura do PRIMEIRO FAQ TRANSFORMADO:', JSON.stringify(transformedFaqs[0], null, 2));
        }

        setFaqsData(transformedFaqs); 
      } else {
        console.log('[FAQSection] Nenhum FAQ encontrado ou dados vazios. Usando mock.');
        setFaqsData([]); // Garante fallback para mock
      }
      setLoading(false);
    }
    fetchFaqs();
  }, []);

  // Log para verificar o que será renderizado
  console.log('[FAQSection] faqsData (do Supabase ou vazio se erro/nada):', faqsData);
  console.log('[FAQSection] faqsToShow (decidido pela lógica de fallback):', faqsToShow);

  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia to-verde-cia-escuro text-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-3 bg-white/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre o Anuário de Saúde
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqsToShow.map((faq: any, index: number) => (
            <motion.div
              key={faq.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-medium text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/70" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-white/90">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;