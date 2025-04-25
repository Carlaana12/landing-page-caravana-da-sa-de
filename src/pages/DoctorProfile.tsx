import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Languages, 
  Shield, 
  Video, 
  Phone, 
  Mail, 
  ArrowLeft,
  FileText,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import { getSpecialistBySlug, getRelatedSpecialists } from '../data/specialists';
import { Specialist } from '../lib/types';
import HeroParallax from '../components/HeroParallax';
import DoctorAbout from '../components/DoctorAbout';
import DoctorServices from '../components/DoctorServices';
import DoctorReviews from '../components/DoctorReviews';
import DoctorCard from '../components/DoctorCard';
import { supabase } from '../lib/supabase';
import AppointmentScheduler from '../components/AppointmentScheduler';

const DoctorProfile: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [doctor, setDoctor] = useState<Specialist | null>(null);
  const [relatedDoctors, setRelatedDoctors] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [liked, setLiked] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    if (slug) {
      console.log("Slug recebido:", slug);
      fetchDoctorFromDB(slug);
    }
    
    setLoading(false);
  }, [slug]);

  const fetchDoctorFromDB = async (doctorSlug: string) => {
    try {
      // Primeiro, verificar se há um perfil público no Supabase com este slug
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('slug', doctorSlug)
        .single();

      if (error) {
        console.error("Erro ao buscar médico no banco de dados:", error);
        
        // Fallback para dados mockados se não encontrar no banco
        const fallbackDoctor = getSpecialistBySlug(doctorSlug);
        if (fallbackDoctor) {
          setDoctor(fallbackDoctor);
          const related = getRelatedSpecialists(fallbackDoctor.specialty, fallbackDoctor.id);
          setRelatedDoctors(related);
        }
        return;
      }

      if (data) {
        // Converter os dados do banco para o formato esperado pelo componente
        const formattedDoctor: Specialist = {
          id: data.id || '',
          name: data.name || '',
          specialty: data.specialty || '',
          city: data.city || 'São Paulo, SP',
          consultationType: data.consultation_type || 'presencial',
          teleconsultation: data.teleconsultation || false,
          exams: data.exams || [],
          location: data.location || 'São Paulo, SP',
          imageUrl: data.image_url,
          rating: data.rating || 4.8,
          reviewCount: data.review_count || 120,
          address: data.address,
          phone: data.phone,
          email: data.email,
          bio: data.bio || 'Informações não disponíveis',
          experience: data.experience ? (Array.isArray(data.experience) ? data.experience.join(', ') : data.experience) : 'Mais de 10 anos',
          availability: data.availability || ['Segunda a Sexta, 8h às 18h'],
          insurance: data.insurance || ['Unimed', 'Bradesco Saúde'],
          languages: data.languages || ['Português', 'Inglês'],
          education: data.education || [],
          achievements: data.achievements || [],
          slug: doctorSlug // Garantir que o slug está preenchido
        };

        setDoctor(formattedDoctor);

        // Buscar médicos relacionados pela especialidade
        const { data: relatedData, error: relatedError } = await supabase
          .from('public_profiles')
          .select('*')
          .eq('specialty', data.specialty)
          .neq('id', data.id)
          .limit(3);

        if (!relatedError && relatedData) {
          const formattedRelated = relatedData.map(doc => ({
            id: doc.id || '',
            name: doc.name || '',
            specialty: doc.specialty || '',
            city: doc.city || 'São Paulo, SP',
            consultationType: doc.consultation_type || 'presencial',
            teleconsultation: doc.teleconsultation || false,
            exams: doc.exams || [],
            location: doc.location || 'São Paulo, SP',
            imageUrl: doc.image_url,
            rating: doc.rating || 4.5,
            reviewCount: doc.review_count || 80,
            address: doc.address,
            phone: doc.phone,
            email: doc.email,
            bio: doc.bio,
            experience: doc.experience,
            availability: doc.availability || ['Segunda a Sexta'],
            insurance: doc.insurance || ['Unimed'],
            languages: doc.languages,
            slug: doc.slug || doc.name?.toLowerCase().replace(/\s+/g, '-') || ''
          })) as Specialist[];
          
          setRelatedDoctors(formattedRelated);
        } else {
          // Fallback para dados mockados se não encontrar relacionados
          const fallbackRelated = getRelatedSpecialists(data.specialty, data.id);
          setRelatedDoctors(fallbackRelated);
        }
      }
    } catch (error) {
      console.error("Erro ao processar dados do médico:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde-cia"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Médico não encontrado</h1>
        <p className="text-gray-600 mb-6">O especialista que você está procurando não foi encontrado.</p>
        <Link 
          to="/encontre-aqui" 
          className="flex items-center text-verde-cia hover:text-verde-cia-escuro transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para busca de especialistas
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Wrapper para o header do perfil */}
      <div className="md:w-screen md:relative md:left-1/2 md:right-1/2 md:-ml-[50vw] md:mr-[50vw] md:max-w-none">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-24 pb-12 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-white">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="relative rounded-xl overflow-hidden aspect-square shadow-lg">
                <img 
                  src={doctor.imageUrl || "https://via.placeholder.com/300?text=No+Image"} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                />
                {doctor.teleconsultation && (
                  <div className="absolute top-4 right-4 bg-verde-cia text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                    Teleconsulta
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm">Favorito</span>
                </button>
                
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm">Compartilhar</span>
                </button>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-xl text-indigo-200 mb-4">{doctor.specialty}</p>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center bg-green-50 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{doctor.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({doctor.reviewCount} avaliações)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo restante DENTRO do container padrão */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="border-b mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'about'
                      ? 'border-verde-cia text-verde-cia'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Sobre
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'services'
                      ? 'border-verde-cia text-verde-cia'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Serviços
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-verde-cia text-verde-cia'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Avaliações
                </button>
              </nav>
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'about' && <DoctorAbout doctor={doctor} />}
              {activeTab === 'services' && <DoctorServices exams={doctor.exams || []} specialty={doctor.specialty} availability={doctor.availability} />}
              {activeTab === 'reviews' && <DoctorReviews doctorName={doctor.name} rating={doctor.rating || 4.8} reviewCount={doctor.reviewCount || 120} />}
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                <span>{doctor.address || doctor.location || doctor.city}</span>
              </div>
              
              {doctor.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{doctor.phone}</span>
                </div>
              )}
              
              {doctor.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{doctor.email}</span>
                </div>
              )}
              
              {doctor.availability && doctor.availability.length > 0 && (
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-gray-400" />
                  <span>{doctor.availability[0]}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAppointmentModal(true)}
                className="flex-1 bg-verde-cia text-white py-3 rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 border-2 border-verde-cia text-verde-cia py-3 rounded-lg hover:bg-verde-cia hover:text-white transition-colors flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Enviar Mensagem
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Doctors */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Outros especialistas em {doctor.specialty}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
          
          {relatedDoctors.length === 0 && (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Não encontramos outros especialistas em {doctor.specialty} no momento.
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Agendamento */}
      {showAppointmentModal && doctor && (
        <AppointmentScheduler 
          doctor={doctor} 
          onClose={() => setShowAppointmentModal(false)}
        />
      )}
    </div>
  );
};

export default DoctorProfile;