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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('admin_contacts')
          .select('*')
          .order('ordem', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const contactDetails = data[0];
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
          if (contactDetails.horario) {
            transformedContacts.push({ 
              id: 'hours_contact', 
              icon: 'Clock', 
              label: 'Horário de Atendimento', 
              value: contactDetails.horario 
            });
          }

          setContactsData(transformedContacts);
        } else {
          setContactsData([]);
        }
      } catch (err) {
        console.error('[ContactSection] Erro ao buscar contatos:', err);
        setError('Não foi possível carregar as informações de contato.');
        setContactsData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      // Aqui você pode adicionar a lógica para enviar o formulário para o backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Adicionar feedback de sucesso aqui
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      // Adicionar feedback de erro aqui
    } finally {
      setSending(false);
    }
  };

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
              {loading ? (
                <div className="text-white/90">Carregando informações...</div>
              ) : error ? (
                <div className="text-red-200">{error}</div>
              ) : (
                contactsData.map((contact) => {
                  const Icon = iconMap[contact.icon as keyof typeof iconMap];
                  return (
                    <div key={contact.id} className="flex items-start space-x-4">
                      <Icon className="w-6 h-6 text-white/90 mt-1" />
                      <div>
                        <h3 className="font-semibold">{contact.label}</h3>
                        <p className="text-white/90">{contact.value}</p>
                      </div>
                    </div>
                  );
                })
              )}
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