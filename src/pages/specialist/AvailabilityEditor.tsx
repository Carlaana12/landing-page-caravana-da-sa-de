import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calendar, Clock, Plus, Trash2, Info, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface TimeSlot {
  day: number; // 0 = domingo, 1 = segunda, ...
  startTime: string;
  endTime: string;
}

interface TimeBlockProps {
  slot: TimeSlot;
  onDelete: () => void;
  onChange: (updatedSlot: TimeSlot) => void;
}

// Componente para blocos de horário individuais
const TimeBlock: React.FC<TimeBlockProps> = ({ slot, onDelete, onChange }) => {
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  const handleChange = (field: keyof TimeSlot, value: any) => {
    onChange({
      ...slot,
      [field]: field === 'day' ? parseInt(value) : value
    });
  };
  
  return (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
      <select
        value={slot.day}
        onChange={(e) => handleChange('day', e.target.value)}
        className="p-2 border rounded-md w-32"
      >
        {days.map((day, index) => (
          <option key={index} value={index}>{day}</option>
        ))}
      </select>
      
      <div className="flex items-center">
        <input
          type="time"
          value={slot.startTime}
          onChange={(e) => handleChange('startTime', e.target.value)}
          className="p-2 border rounded-md w-28"
        />
        <span className="mx-2">até</span>
        <input
          type="time"
          value={slot.endTime}
          onChange={(e) => handleChange('endTime', e.target.value)}
          className="p-2 border rounded-md w-28"
        />
      </div>
      
      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        title="Remover horário"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

// Template de horários padrão
const availabilityTemplates = [
  {
    name: 'Horário comercial (8h às 18h)',
    slots: [
      { day: 1, startTime: '08:00', endTime: '12:00' },
      { day: 1, startTime: '14:00', endTime: '18:00' },
      { day: 2, startTime: '08:00', endTime: '12:00' },
      { day: 2, startTime: '14:00', endTime: '18:00' },
      { day: 3, startTime: '08:00', endTime: '12:00' },
      { day: 3, startTime: '14:00', endTime: '18:00' },
      { day: 4, startTime: '08:00', endTime: '12:00' },
      { day: 4, startTime: '14:00', endTime: '18:00' },
      { day: 5, startTime: '08:00', endTime: '12:00' },
      { day: 5, startTime: '14:00', endTime: '18:00' },
    ]
  },
  {
    name: 'Meio período (manhãs)',
    slots: [
      { day: 1, startTime: '08:00', endTime: '12:00' },
      { day: 2, startTime: '08:00', endTime: '12:00' },
      { day: 3, startTime: '08:00', endTime: '12:00' },
      { day: 4, startTime: '08:00', endTime: '12:00' },
      { day: 5, startTime: '08:00', endTime: '12:00' },
    ]
  },
  {
    name: 'Horário estendido (tardes e noites)',
    slots: [
      { day: 1, startTime: '14:00', endTime: '20:00' },
      { day: 2, startTime: '14:00', endTime: '20:00' },
      { day: 3, startTime: '14:00', endTime: '20:00' },
      { day: 4, startTime: '14:00', endTime: '20:00' },
      { day: 5, startTime: '14:00', endTime: '20:00' },
    ]
  },
  {
    name: 'Fins de semana (sábados)',
    slots: [
      { day: 6, startTime: '09:00', endTime: '17:00' },
    ]
  }
];

// Componente principal
const AvailabilityEditor: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [consultationDuration, setConsultationDuration] = useState(30); // Duração em minutos
  const [teleconsultationEnabled, setTeleconsultationEnabled] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Carregar disponibilidade atual
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        
        // Verificar usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/especialista/login');
          return;
        }
        
        // Buscar dados do médico
        const { data: profileData, error: profileError } = await supabase
          .from('partner_profiles')
          .select('availability_slots, consultation_duration, teleconsultation')
          .eq('user_id', user.id)
          .single();
          
        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          toast.error('Erro ao carregar dados de disponibilidade');
          return;
        }
        
        if (profileData) {
          // Se tiver dados de disponibilidade, carregar
          if (profileData.availability_slots && profileData.availability_slots.length > 0) {
            setTimeSlots(profileData.availability_slots);
          } else {
            // Caso contrário, iniciar com um slot vazio
            setTimeSlots([
              { day: 1, startTime: '09:00', endTime: '17:00' }
            ]);
          }
          
          // Carregar outras configurações
          if (profileData.consultation_duration) {
            setConsultationDuration(profileData.consultation_duration);
          }
          
          if (profileData.teleconsultation !== undefined) {
            setTeleconsultationEnabled(profileData.teleconsultation);
          }
        }
      } catch (error) {
        console.error('Erro:', error);
        toast.error('Ocorreu um erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [navigate]);
  
  // Adicionar novo horário
  const addTimeSlot = () => {
    // Encontrar o próximo dia da semana onde não há slot ainda
    const existingDays = timeSlots.map(slot => slot.day);
    let nextDay = 1; // Começar com segunda-feira
    
    // Encontrar o próximo dia de semana que não está completamente preenchido
    while (existingDays.includes(nextDay) && nextDay < 6) {
      nextDay++;
    }
    
    setTimeSlots([
      ...timeSlots,
      { day: nextDay, startTime: '09:00', endTime: '17:00' }
    ]);
  };
  
  // Remover horário
  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };
  
  // Atualizar horário
  const updateTimeSlot = (index: number, updatedSlot: TimeSlot) => {
    const newSlots = [...timeSlots];
    newSlots[index] = updatedSlot;
    setTimeSlots(newSlots);
  };
  
  // Aplicar template
  const applyTemplate = (templateIndex: number) => {
    setTimeSlots(availabilityTemplates[templateIndex].slots);
    setShowTemplates(false);
    toast.success('Template aplicado com sucesso!');
  };
  
  // Salvar disponibilidade
  const saveAvailability = async () => {
    try {
      setSaving(true);
      
      // Verificar usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/especialista/login');
        return;
      }
      
      // Ordenar horários por dia da semana
      const sortedSlots = [...timeSlots].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
      });
      
      // Atualizar no banco de dados
      const { error } = await supabase
        .from('partner_profiles')
        .update({
          availability_slots: sortedSlots,
          consultation_duration: consultationDuration,
          teleconsultation: teleconsultationEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Disponibilidade salva com sucesso!');
      
      // Também atualizar a tabela public_profiles para sincronizar
      await supabase
        .from('public_profiles')
        .update({
          availability_slots: sortedSlots,
          consultation_duration: consultationDuration,
          teleconsultation: teleconsultationEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      setTimeout(() => {
        navigate('/especialista/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Erro ao salvar disponibilidade:', error);
      toast.error('Erro ao salvar disponibilidade');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-verde-cia"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/especialista/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span>Voltar</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Disponibilidade para Consultas
            </h1>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6">
            <p className="text-gray-600">
              Configure seus horários de atendimento para que os pacientes possam agendar consultas nos horários disponíveis.
            </p>
          </div>
          
          {/* Templates de Horários */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              <span>Usar template de horário</span>
            </button>
            
            {showTemplates && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {availabilityTemplates.map((template, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 hover:border-verde-cia hover:shadow-md cursor-pointer"
                    onClick={() => applyTemplate(index)}
                  >
                    <h3 className="font-medium text-lg mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.slots.length} períodos configurados</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Configurações Gerais */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium mb-4">Configurações Gerais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração da Consulta
                </label>
                <select
                  value={consultationDuration}
                  onChange={(e) => setConsultationDuration(parseInt(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora</option>
                  <option value={90}>1 hora e 30 minutos</option>
                  <option value={120}>2 horas</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={teleconsultationEnabled}
                    onChange={(e) => setTeleconsultationEnabled(e.target.checked)}
                    className="w-5 h-5 text-verde-cia"
                  />
                  <span className="ml-2 font-medium">Oferecer Teleconsulta</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Marque esta opção para permitir que pacientes agendem teleconsultas
                </p>
              </div>
            </div>
          </div>
          
          {/* Horários de Atendimento */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Horários de Atendimento</h2>
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center text-verde-cia hover:text-verde-cia-escuro"
              >
                <Plus className="w-5 h-5 mr-1" />
                <span>Adicionar Horário</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {timeSlots.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
                  <Info className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
                  <p className="text-yellow-700">
                    Você ainda não definiu horários de atendimento. Adicione pelo menos um horário ou use um template.
                  </p>
                </div>
              ) : (
                timeSlots.map((slot, index) => (
                  <TimeBlock
                    key={index}
                    slot={slot}
                    onDelete={() => removeTimeSlot(index)}
                    onChange={(updatedSlot) => updateTimeSlot(index, updatedSlot)}
                  />
                ))
              )}
            </div>

            {timeSlots.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <p className="text-blue-700 text-sm">
                    Os horários serão divididos automaticamente em intervalos de {consultationDuration} minutos para agendamento.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 mt-8">
            <Link
              to="/especialista/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            
            <button
              type="button"
              onClick={saveAvailability}
              disabled={saving || timeSlots.length === 0}
              className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro disabled:opacity-70 flex items-center"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              <span>Salvar Disponibilidade</span>
            </button>
          </div>
        </div>
        
        {/* Preview do Calendário */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-medium mb-4">Visualização do Calendário</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
                <div key={index} className="text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                // Verificar se há horários para este dia
                const hasSlotsForDay = timeSlots.some(slot => slot.day === dayIndex);
                
                return (
                  <div 
                    key={dayIndex}
                    className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center ${
                      hasSlotsForDay ? 'bg-verde-cia text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <span className="font-medium">{dayIndex + 1}</span>
                    {hasSlotsForDay ? (
                      <Check className="w-5 h-5 mt-1" />
                    ) : (
                      <span className="text-xs mt-1">Indisponível</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="text-sm text-gray-500 mt-4 text-center">
              Visualização simplificada. Os pacientes verão horários específicos disponíveis para agendamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityEditor; 