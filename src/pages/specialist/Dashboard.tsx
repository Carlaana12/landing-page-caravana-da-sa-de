import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Star, FileText, Settings, Edit, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const SpecialistDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    phone: '',
    email: '',
    address: '',
    working_hours: ''
  });

  const stats = [
    {
      label: 'Pacientes Hoje',
      value: '8',
      icon: Users,
      trend: '+2',
      trendType: 'up'
    },
    {
      label: 'Próxima Consulta',
      value: '14:30',
      icon: Clock,
      description: 'Em 30 minutos'
    },
    {
      label: 'Avaliação',
      value: '4.9',
      icon: Star,
      description: '32 avaliações'
    }
  ];

  const appointments = [
    {
      time: '14:30',
      patient: 'Maria Silva',
      type: 'Consulta de Rotina',
      status: 'próxima'
    },
    {
      time: '15:00',
      patient: 'João Santos',
      type: 'Retorno',
      status: 'confirmada'
    },
    {
      time: '15:30',
      patient: 'Ana Costa',
      type: 'Primeira Consulta',
      status: 'pendente'
    }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Erro ao carregar perfil');
      } else if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          specialty: data.specialty || '',
          bio: data.bio || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          working_hours: data.working_hours || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('partner_profiles')
        .update({
          name: formData.name,
          specialty: formData.specialty,
          bio: formData.bio,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          working_hours: formData.working_hours,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Perfil atualizado com sucesso');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Profissional</h1>
          <p className="text-gray-600">Gerencie seus atendimentos e pacientes</p>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Meu Perfil</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center text-verde-cia hover:text-verde-cia-escuro"
              >
                <Edit className="w-5 h-5 mr-1" />
                <span>Editar</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Save className="w-5 h-5 mr-1" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5 mr-1" />
                  <span>Cancelar</span>
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-verde-cia"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {editing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Atendimento</label>
                    <input
                      type="text"
                      value={formData.working_hours}
                      onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Ex: Segunda a Sexta, 8h às 18h"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biografia</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                    <p className="mt-1">{profile?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Especialidade</h3>
                    <p className="mt-1">{profile?.specialty || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p className="mt-1">{profile?.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{profile?.email || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                    <p className="mt-1">{profile?.address || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Horário de Atendimento</h3>
                    <p className="mt-1">{profile?.working_hours || 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Biografia</h3>
                    <p className="mt-1">{profile?.bio || 'Não informado'}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-verde-cia/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-verde-cia" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  {stat.trend && (
                    <span className={`ml-2 text-sm ${
                      stat.trendType === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.label}</h3>
              {stat.description && (
                <p className="text-sm text-gray-500">{stat.description}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={Calendar}
            title="Agenda"
            description="Visualize seus compromissos"
          />
          <QuickAction
            icon={Users}
            title="Pacientes"
            description="Gerencie seus pacientes"
          />
          <QuickAction
            icon={FileText}
            title="Documentos"
            description="Emita documentos médicos"
          />
          <QuickAction
            icon={Settings}
            title="Configurações"
            description="Ajuste suas preferências"
          />
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Agenda de Hoje</h2>
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {appointment.time}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  appointment.status === 'próxima'
                    ? 'bg-blue-100 text-blue-800'
                    : appointment.status === 'confirmada'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all cursor-pointer"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-verde-cia/10 rounded-lg">
        <Icon className="h-6 w-6 text-verde-cia" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default SpecialistDashboard;