import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const iconMap = { Phone, Mail, MapPin, Clock };

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [sending, setSending] = useState(false);
  const [contactsData, setContactsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_contacts')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) {
        console.error('[ContactSection] Erro ao buscar contatos:', error);
        setContactsData([]);
      } else if (data && data.length > 0) {
        console.log('[ContactSection] Contato GERAL recebido do Supabase:', data[0]);
        const contactDetails = data[0]; // Pegamos o primeiro (e único esperado) objeto
        const transformedContacts = [];

        if (contactDetails.telefone) {
          transformedContacts.push({ 
            id: 'phone_contact', 
            icon: 'Phone', 
            label: 'Telefone', 
            value: contactDetails.telefone 
          });
        }
        if (contactDetails.email) {
          transformedContacts.push({ 
            id: 'email_contact', 
            icon: 'Mail', 
            label: 'Email', 
            value: contactDetails.email 
          });
        }
        if (contactDetails.endereco) {
          transformedContacts.push({ 
            id: 'address_contact', 
            icon: 'MapPin', 
            label: 'Endereço', 
            value: contactDetails.endereco 
          });
        }
        // Adicione aqui outros campos como Horário, se existirem em contactDetails
        // Exemplo: 
        // if (contactDetails.horario) {
        //   transformedContacts.push({ 
        //     id: 'hours_contact', 
        //     icon: 'Clock', 
        //     label: 'Atendimento', 
        //     value: contactDetails.horario 
        //   });
        // }

        console.log('[ContactSection] Contatos TRANSFORMADOS para lista:', transformedContacts);
        setContactsData(transformedContacts);
      } else {
        console.log('[ContactSection] Nenhum contato encontrado ou dados vazios.');
        setContactsData([]);
      }
      setLoading(false);
    }
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setSending(false);
  };

  const contactsToShow = contactsData;
  console.log('[ContactSection] contactsToShow:', contactsToShow);

  return (
    <section className="py-16">
      <div className="bg-verde-cia rounded-xl overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Entre em Contato</h2>
            <p className="mb-8 text-white/90">
              Estamos aqui para ajudar. Entre em contato conosco para mais informações.
            </p>
            
            <div className="space-y-6">
              {contactsToShow.map((contact: any) => {
                const iconKey = typeof contact.icon === 'string' ? contact.icon : '';
                const Icon = iconMap[iconKey as keyof typeof iconMap] || Phone;
                return (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: contact.id * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mr-4">
                      <Icon />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">{contact.label}</p>
                      <p className="font-medium">{contact.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 rounded-l-3xl shadow-inner"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-verde-cia hover:bg-verde-cia-escuro text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{sending ? 'Enviando...' : 'Enviar Mensagem'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;