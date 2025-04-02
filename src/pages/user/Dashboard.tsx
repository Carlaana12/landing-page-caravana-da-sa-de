import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Bell, Settings, User, Activity, Edit, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    birth_date: '',
    address: '',
    email_verified: false
  });

  const stats = [
    {
      label: 'Próxima Consulta',
      value: '15/04/2024',
      icon: Calendar,
      description: 'Dr. João Santos - Cardiologia'
    },
    {
      label: 'Exames Pendentes',
      value: '2',
      icon: FileText,
      description: 'Aguardando realização'
    },
    {
      label: 'Notificações',
      value: '3',
      icon: Bell,
      description: 'Mensagens não lidas'
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
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Erro ao carregar perfil');
      } else if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          birth_date: data.birth_date || '',
          address: data.address || '',
          email_verified: data.email_verified || false
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
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          birth_date: formData.birth_date,
          address: formData.address,
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
          <h1 className="text-2xl font-bold text-gray-800">Meu Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao seu portal de saúde</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
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
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                    <p className="mt-1">{profile?.full_name || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                    <p className="mt-1">{profile?.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                    <p className="mt-1">{profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                    <p className="mt-1">{profile?.address || 'Não informado'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status do Email</h3>
                    <p className="mt-1">
                      {profile?.email_verified ? (
                        <span className="text-green-600">Verificado</span>
                      ) : (
                        <span className="text-red-600">Não verificado</span>
                      )}
                    </p>
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
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <h3 className="text-gray-600 font-medium">{stat.label}</h3>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction
            icon={Calendar}
            title="Agendar Consulta"
            description="Marque sua próxima consulta"
          />
          <QuickAction
            icon={FileText}
            title="Meus Exames"
            description="Visualize seus resultados"
          />
          <QuickAction
            icon={Activity}
            title="Histórico Médico"
            description="Acesse seu histórico"
          />
          <QuickAction
            icon={User}
            title="Meu Perfil"
            description="Atualize suas informações"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Consulta agendada</p>
                  <p className="text-sm text-gray-500">Há 5 minutos</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Novo
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

export default UserDashboard;