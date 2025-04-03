import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import PartnerLayout from '../../components/partner/PartnerLayout';
import { Save, Upload, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface PartnerProfile {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  bio: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  working_hours: string;
  profile_image: string;
  certifications: string[];
  languages: string[];
  insurance_accepted: string[];
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<PartnerProfile>>({
    name: '',
    specialty: '',
    bio: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    working_hours: '',
    profile_image: '',
    certifications: [],
    languages: [],
    insurance_accepted: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('partner_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('partner_profiles')
        .upsert({
          ...profile,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Perfil salvo com sucesso');
    } catch (error) {
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="text-center py-4">Carregando...</div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={profile.profile_image || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name || 'Seu Nome'}</h2>
                <p className="text-gray-600">{profile.specialty || 'Sua Especialidade'}</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade
                </label>
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografia
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Endereço
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Horário de Atendimento
                </label>
                <input
                  type="text"
                  value={profile.working_hours}
                  onChange={(e) => setProfile({ ...profile, working_hours: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Ex: Seg-Sex: 9h-18h"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Informações Adicionais</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certificações
                </label>
                <input
                  type="text"
                  value={profile.certifications?.join(', ')}
                  onChange={(e) => setProfile({
                    ...profile,
                    certifications: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Separe as certificações por vírgula"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idiomas
                </label>
                <input
                  type="text"
                  value={profile.languages?.join(', ')}
                  onChange={(e) => setProfile({
                    ...profile,
                    languages: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Separe os idiomas por vírgula"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Convênios Aceitos
                </label>
                <input
                  type="text"
                  value={profile.insurance_accepted?.join(', ')}
                  onChange={(e) => setProfile({
                    ...profile,
                    insurance_accepted: e.target.value.split(',').map(s => s.trim())
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Separe os convênios por vírgula"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </PartnerLayout>
  );
};

export default Profile;