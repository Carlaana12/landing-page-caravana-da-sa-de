import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, MapPin, Clock, AlertCircle, Stethoscope, Pill, Ambulance, Guitar as Hospital } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import HeroParallax from '@/components/HeroParallax';
import 'leaflet/dist/leaflet.css';

const emergencyContacts = [
  { icon: Phone, label: 'SAMU', number: '192' },
  { icon: Phone, label: 'Bombeiros', number: '193' },
  { icon: Phone, label: 'Polícia', number: '190' },
  { icon: Phone, label: 'Defesa Civil', number: '199' },
];

const hospitals = [
  {
    name: 'Hospital São Lucas',
    address: 'Av. Principal, 1000',
    phone: '(11) 1234-5678',
    type: 'Geral',
    coordinates: [-23.5505, -46.6333]
  },
  {
    name: 'Hospital Santa Maria',
    address: 'Rua Secundária, 500',
    phone: '(11) 8765-4321',
    type: 'Especializado',
    coordinates: [-23.5605, -46.6433]
  },
  // Add more hospitals...
];

const pharmacies = [
  {
    name: 'Farmácia 24h',
    address: 'Av. Comercial, 200',
    phone: '(11) 2345-6789',
    hours: '24 horas',
    coordinates: [-23.5525, -46.6353]
  },
  // Add more pharmacies...
];

const PublicUtilities = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Utilidades Públicas"
        description="Informações importantes e serviços de emergência"
        image="https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Serviços de Emergência',
          2000,
          'Hospitais Próximos',
          2000,
          'Farmácias de Plantão',
          2000
        ]}
      />

      {/* Emergency Contacts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 -mt-20 relative z-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Telefones de Emergência</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <contact.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold mb-1">{contact.label}</h3>
                <p className="text-2xl font-bold text-red-600">{contact.number}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Mapa de Serviços</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-[500px]">
            <MapContainer
              center={[-23.5505, -46.6333]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {hospitals.map((hospital, index) => (
                <Marker key={index} position={hospital.coordinates}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <p className="text-sm">{hospital.address}</p>
                      <p className="text-sm">{hospital.phone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {pharmacies.map((pharmacy, index) => (
                <Marker key={index} position={pharmacy.coordinates}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{pharmacy.name}</h3>
                      <p className="text-sm">{pharmacy.address}</p>
                      <p className="text-sm">{pharmacy.hours}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8">Serviços Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={Hospital}
            title="Hospitais"
            description="Lista de hospitais públicos e privados"
          />
          <ServiceCard
            icon={Ambulance}
            title="Pronto Socorro"
            description="Unidades de emergência 24h"
          />
          <ServiceCard
            icon={Pill}
            title="Farmácias"
            description="Farmácias de plantão"
          />
          <ServiceCard
            icon={Stethoscope}
            title="UBS"
            description="Unidades Básicas de Saúde"
          />
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="w-12 h-12 bg-verde-cia/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-verde-cia" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default PublicUtilities;