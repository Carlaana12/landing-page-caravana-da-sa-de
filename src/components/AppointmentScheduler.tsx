import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MessageSquare, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Specialist } from '../lib/types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AppointmentSchedulerProps {
  doctor: Specialist;
  onClose: () => void;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentFormData {
  date: string;
  time: string;
  type: 'in-person' | 'teleconsultation';
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ doctor, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: '',
    time: '',
    type: 'in-person',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  
  // Gere datas disponíveis para os próximos 30 dias
  useEffect(() => {
    const dates = [];
    const now = new Date();
    
    // Adiciona os próximos 30 dias, excluindo domingos
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      
      // Pula domingos (0 = domingo)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    setAvailableDates(dates);
  }, []);
  
  // Simulação de horários disponíveis para uma data
  const fetchTimeSlots = (date: string) => {
    // Normalmente, aqui você faria uma chamada ao backend para obter os horários disponíveis
    // Vamos simular isso com dados mock
    
    setLoading(true);
    
    // Simula a chamada ao backend
    setTimeout(() => {
      const slots = [
        { id: '1', time: '08:00', available: true },
        { id: '2', time: '09:00', available: true },
        { id: '3', time: '10:00', available: false },
        { id: '4', time: '11:00', available: true },
        { id: '5', time: '13:00', available: true },
        { id: '6', time: '14:00', available: true },
        { id: '7', time: '15:00', available: false },
        { id: '8', time: '16:00', available: true },
        { id: '9', time: '17:00', available: true }
      ];
      
      setTimeSlots(slots);
      setLoading(false);
    }, 500);
  };
  
  // Quando a data é selecionada, busca os horários disponíveis
  useEffect(() => {
    if (formData.date) {
      fetchTimeSlots(formData.date);
    }
  }, [formData.date]);
  
  // Manipulador para alteração de dados do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manipulador para seleção de data
  const handleDateSelect = (date: string) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
  };
  
  // Manipulador para seleção de horário
  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };
  
  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Verificar se o usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirecionar para login ou mostrar modal de login
        toast.error('Você precisa fazer login para agendar uma consulta');
        return;
      }
      
      // Dados da consulta
      const appointmentData = {
        doctor_id: doctor.id,
        patient_id: user.id,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: 'scheduled',
        notes: formData.notes,
        patient_name: formData.name,
        patient_email: formData.email,
        patient_phone: formData.phone,
        created_at: new Date().toISOString()
      };
      
      // Inserir no banco de dados
      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);
      
      if (error) throw error;
      
      toast.success('Consulta agendada com sucesso!');
      setStep(3); // Vai para a confirmação
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      toast.error('Ocorreu um erro ao agendar sua consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Renderiza o formulário baseado no passo atual
  const renderStep = () => {
    switch (step) {
      case 1: // Seleção de data e hora
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Selecione a Data e Horário</h3>
            
            {/* Seleção de tipo de consulta */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Consulta</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border ${
                    formData.type === 'in-person' 
                      ? 'border-verde-cia bg-verde-cia/10 text-verde-cia' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'in-person' }))}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Presencial</span>
                </button>
                
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-3 rounded-lg border ${
                    formData.type === 'teleconsultation' 
                      ? 'border-verde-cia bg-verde-cia/10 text-verde-cia' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'teleconsultation' }))}
                  disabled={!doctor.teleconsultation}
                >
                  <Video className="w-5 h-5 mr-2" />
                  <span>Teleconsulta</span>
                </button>
              </div>
              
              {!doctor.teleconsultation && (
                <p className="text-sm text-gray-500 mt-1">Este médico não oferece teleconsultas</p>
              )}
            </div>
            
            {/* Calendário de datas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data da Consulta</label>
              <div className="grid grid-cols-4 gap-2">
                {availableDates.slice(0, 12).map(date => {
                  const d = new Date(date);
                  const isSelected = date === formData.date;
                  
                  return (
                    <button
                      key={date}
                      type="button"
                      className={`p-2 rounded-lg text-center ${
                        isSelected 
                          ? 'bg-verde-cia text-white' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <span className="block text-xs">{d.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                      <span className="block text-lg font-semibold">{d.getDate()}</span>
                      <span className="block text-xs">{d.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Horários disponíveis */}
            {formData.date && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário Disponível</label>
                
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-verde-cia"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        className={`p-2 rounded-lg text-center ${
                          !slot.available 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : slot.time === formData.time
                              ? 'bg-verde-cia text-white'
                              : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <span>{slot.time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.date || !formData.time}
                className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro disabled:opacity-60 disabled:cursor-not-allowed flex items-center"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        );
        
      case 2: // Informações do paciente
        return (
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-4">Suas Informações</h3>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Informe motivo da consulta ou outras informações relevantes"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                Detalhes da Consulta:
              </h4>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Médico:</strong> {doctor.name}</p>
                <p><strong>Especialidade:</strong> {doctor.specialty}</p>
                <p>
                  <strong>Tipo:</strong> {formData.type === 'in-person' ? 'Presencial' : 'Teleconsulta'}
                </p>
                <p>
                  <strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}
                </p>
                <p><strong>Horário:</strong> {formData.time}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro disabled:opacity-60 flex items-center"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                <span>Confirmar Agendamento</span>
              </button>
            </div>
          </form>
        );
        
      case 3: // Confirmação
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Agendamento Confirmado!</h3>
            <p className="text-gray-600 mb-6">
              Sua consulta com {doctor.name} foi agendada com sucesso.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h4 className="font-semibold mb-2">Detalhes da Consulta:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Médico:</strong> {doctor.name}</p>
                <p><strong>Especialidade:</strong> {doctor.specialty}</p>
                <p>
                  <strong>Tipo:</strong> {formData.type === 'in-person' ? 'Presencial' : 'Teleconsulta'}
                </p>
                <p>
                  <strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}
                </p>
                <p><strong>Horário:</strong> {formData.time}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm">
                    Você receberá um e-mail com os detalhes da sua consulta e instruções adicionais.
                    Em caso de dúvidas, entre em contato com o consultório.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro mx-auto"
            >
              Concluir
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Agendar Consulta</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
          
          {renderStep()}
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentScheduler; 