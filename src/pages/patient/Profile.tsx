import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface PatientProfile {
  id: string;
  full_name: string;
  email: string;
  birth_date: string;
  gender: string;
  phone: string;
  address: string;
  profile_photo_url: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Informações Pessoais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <p className="mt-1">{profile?.full_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <p className="mt-1">{profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gênero</label>
              <p className="mt-1">{profile?.gender || '-'}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Contato</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <p className="mt-1">{profile?.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <p className="mt-1">{profile?.address || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 