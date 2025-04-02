import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import HeroParallax from '@/components/HeroParallax';
import 'leaflet/dist/leaflet.css';

const contactInfo = {
  phone: '(61) 98192-6686',
  email: 'ciacomunicacaointegrada@gmail.com',
  address: 'SIBIS Núcleo Bandeirante DF',
  hours: 'Segunda a Sexta: 9h às 18h'
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Fale Conosco"
        description="Estamos aqui para ajudar. Entre em contato conosco."
        image="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Dúvidas?',
          2000,
          'Sugestões?',
          2000,
          'Parcerias?',
          2000,
          'Fale Conosco',
          2000
        ]}
      />

      {/* Contact Information */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Envie sua mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                  Assunto
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-verde-cia hover:bg-verde-cia-escuro text-white py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-verde-cia" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-semibold">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-verde-cia" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-verde-cia" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-semibold">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-verde-cia" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horário de Atendimento</p>
                    <p className="font-semibold">{contactInfo.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-[300px]">
                <MapContainer
                  center={[-23.5505, -46.6333]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[-23.5505, -46.6333]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">Anuário & Saúde</h3>
                        <p className="text-sm">{contactInfo.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;