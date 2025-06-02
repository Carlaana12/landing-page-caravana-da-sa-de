import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

const iconMap = {
  telefone: Phone,
  // Adicione outros ícones conforme necessário
};

const Telefone = Phone;

// Exemplo de contatos. Substitua pelo seu array real se vier de props ou contexto.
const contactsToShow = [
  { id: 1, rotulo: 'Telefone', valor: '(61) 99999-9999', icone: 'telefone' },
  // ...outros contatos
];

const ContactSection = () => (
  <div>
    {contactsToShow.map((contato: any) => {
      const iconKey = typeof contato.icone === 'string' ? contato.icone : '';
      const Icone = iconMap[iconKey as keyof typeof iconMap] || Telefone;
      return (
        <motion.div
          key={contato.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: contato.id * 0.1 }}
          className="flex items-center"
        >
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
            <Icone />
          </div>
          <p className="text-sm text-white/70">{contato.rotulo}</p>
          <p className="font-medium">{contato.valor}</p>
        </motion.div>
      );
    })}
  </div>
);

export default ContactSection; 