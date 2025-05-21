import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
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
    answer: 'Você pode entrar em contato conosco através da página "Fale Conosco", pelo e-mail anuariodesaude@gmail.com ou pelo telefone (61) 3522-8610.'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
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