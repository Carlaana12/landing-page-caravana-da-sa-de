import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Plus, Trash2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const ProfileEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  // Form data para o perfil público
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    bio: '',
    short_description: '',
    imageUrl: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    rating: 0,
    availability: [''],
    education: [''],
    experience: [''],
    languages: [''],
    insurance: [''],
    teleconsultation: false,
    exams: [''],
    specialties: [''],
    achievements: [''],
    social_media: {
      instagram: '',
      linkedin: '',
      facebook: '',
      twitter: ''
    }
  });

  // Funções auxiliares para arrays dinâmicos
  const addField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateField = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  // Carregar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/especialista/login');
          return;
        }

        // Buscar dados do perfil atual
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
          
          // Buscar dados do perfil público
          const { data: publicProfile, error: publicProfileError } = await supabase
            .from('admin_doctor_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!publicProfileError && publicProfile) {
            // Preencher o formulário com dados existentes
            setFormData({
              name: publicProfile.name || data.full_name || '',
              specialty: publicProfile.specialty || data.specialty || '',
              bio: publicProfile.bio || '',
              short_description: publicProfile.short_description || '',
              imageUrl: publicProfile.image_url || '',
              email: publicProfile.email || data.email || '',
              phone: publicProfile.phone || data.phone || '',
              address: publicProfile.address || data.address || '',
              location: publicProfile.location || data.location || '',
              rating: publicProfile.rating || 0,
              availability: publicProfile.availability || [''],
              education: publicProfile.education || [''],
              experience: publicProfile.experience || [''],
              languages: publicProfile.languages || ['Português'],
              insurance: publicProfile.insurance || [''],
              teleconsultation: publicProfile.teleconsultation || false,
              exams: publicProfile.exams || [''],
              specialties: publicProfile.specialties || [data.specialty || ''],
              achievements: publicProfile.achievements || [''],
              social_media: publicProfile.social_media || {
                instagram: '',
                linkedin: '',
                facebook: '',
                twitter: ''
              }
            });
          } else {
            // Perfil público ainda não existe, usar dados do perfil principal
            setFormData(prev => ({
              ...prev,
              name: data.full_name || '',
              specialty: data.specialty || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Salvar perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Gerar slug a partir do nome
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

      // Verificar se o perfil público já existe
      const { data: existingProfile } = await supabase
        .from('admin_doctor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Atualizar perfil existente
        const { error } = await supabase
          .from('admin_doctor_profiles')
          .update({
            name: formData.name,
            specialty: formData.specialty,
            slug,
            bio: formData.bio,
            short_description: formData.short_description,
            image_url: formData.imageUrl,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            location: formData.location,
            rating: formData.rating,
            availability: formData.availability.filter(item => item.trim() !== ''),
            education: formData.education.filter(item => item.trim() !== ''),
            experience: formData.experience.filter(item => item.trim() !== ''),
            languages: formData.languages.filter(item => item.trim() !== ''),
            insurance: formData.insurance.filter(item => item.trim() !== ''),
            teleconsultation: formData.teleconsultation,
            exams: formData.exams.filter(item => item.trim() !== ''),
            specialties: formData.specialties.filter(item => item.trim() !== ''),
            achievements: formData.achievements.filter(item => item.trim() !== ''),
            social_media: formData.social_media,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProfile.id);

        if (error) throw error;
      } else {
        // Criar novo perfil
        const { error } = await supabase
          .from('admin_doctor_profiles')
          .insert([{
            user_id: user.id,
            name: formData.name,
            specialty: formData.specialty,
            slug,
            bio: formData.bio,
            short_description: formData.short_description,
            image_url: formData.imageUrl,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            location: formData.location,
            rating: formData.rating,
            availability: formData.availability.filter(item => item.trim() !== ''),
            education: formData.education.filter(item => item.trim() !== ''),
            experience: formData.experience.filter(item => item.trim() !== ''),
            languages: formData.languages.filter(item => item.trim() !== ''),
            insurance: formData.insurance.filter(item => item.trim() !== ''),
            teleconsultation: formData.teleconsultation,
            exams: formData.exams.filter(item => item.trim() !== ''),
            specialties: formData.specialties.filter(item => item.trim() !== ''),
            achievements: formData.achievements.filter(item => item.trim() !== ''),
            social_media: formData.social_media,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
      }

      // Atualizar o status do perfil principal
      await supabase
        .from('partner_profiles')
        .update({
          public_profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      toast.success('Perfil público atualizado com sucesso!');
      navigate('/especialista/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link to="/especialista/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>Voltar</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Editar Perfil Público</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Informações Básicas</h2>
              </div>

              {/* Foto de Perfil */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Enviar imagem</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      Recomendado: 400x400px, JPG ou PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Campo URL da imagem (temporário) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem (temporário)</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="https://exemplo.com/minha-foto.jpg"
                />
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Dr. João Silva"
                  required
                />
              </div>

              {/* Especialidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidade Principal*</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Cardiologia"
                  required
                />
              </div>

              {/* Descrição curta */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Curta (limite de 150 caracteres)</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Cardiologista com 10 anos de experiência em..."
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.short_description.length}/150 caracteres
                </p>
              </div>

              {/* Biografia */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Biografia Profissional*</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={6}
                  placeholder="Descreva sua trajetória profissional, áreas de atuação e abordagem com pacientes..."
                  required
                />
              </div>

              {/* Seção de Contato */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Informações de Contato</h2>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Profissional</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="contato@exemplo.com.br"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone para Contato</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço do Consultório</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Av. Paulista, 1000, Sala 123"
                />
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade/Estado</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="São Paulo, SP"
                />
              </div>

              {/* Redes Sociais */}
              <div className="md:col-span-2">
                <h3 className="text-md font-medium mb-2">Redes Sociais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                    <input
                      type="text"
                      value={formData.social_media.instagram}
                      onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="@seuusuario"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={formData.social_media.linkedin}
                      onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="linkedin.com/in/seuperfil"
                    />
                  </div>
                </div>
              </div>

              {/* Seção de Qualificações */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Qualificações Profissionais</h2>
              </div>

              {/* Especialidades */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidades</label>
                {formData.specialties.map((specialty, index) => (
                  <div key={`specialty-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => updateField('specialties', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Cardiologia Pediátrica"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('specialties', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('specialties')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar especialidade</span>
                </button>
              </div>

              {/* Formação */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Formação Acadêmica</label>
                {formData.education.map((edu, index) => (
                  <div key={`edu-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => updateField('education', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Medicina - Universidade de São Paulo (2010)"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('education', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('education')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar formação</span>
                </button>
              </div>

              {/* Experiência */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experiência Profissional</label>
                {formData.experience.map((exp, index) => (
                  <div key={`exp-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={exp}
                      onChange={(e) => updateField('experience', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Cardiologista no Hospital Albert Einstein (2015-atual)"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('experience', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('experience')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar experiência</span>
                </button>
              </div>

              {/* Seção de Serviços */}
              <div className="md:col-span-2 mt-4">
                <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Serviços e Disponibilidade</h2>
              </div>

              {/* Exames */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Exames e Procedimentos</label>
                {formData.exams.map((exam, index) => (
                  <div key={`exam-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={exam}
                      onChange={(e) => updateField('exams', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Ecocardiograma, Teste Ergométrico"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('exams', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('exams')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar exame/procedimento</span>
                </button>
              </div>

              {/* Convênios */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Convênios Aceitos</label>
                {formData.insurance.map((ins, index) => (
                  <div key={`ins-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={ins}
                      onChange={(e) => updateField('insurance', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Unimed, Bradesco Saúde"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('insurance', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('insurance')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar convênio</span>
                </button>
              </div>

              {/* Disponibilidade */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Horários de Atendimento</label>
                {formData.availability.map((avail, index) => (
                  <div key={`avail-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={avail}
                      onChange={(e) => updateField('availability', index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md rounded-r-none"
                      placeholder="Ex: Segunda a Sexta, das 8h às 18h"
                    />
                    <button
                      type="button"
                      onClick={() => removeField('availability', index)}
                      className="px-3 py-2 bg-red-50 text-red-500 rounded-r-md border border-l-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField('availability')}
                  className="mt-1 flex items-center text-verde-cia hover:text-verde-cia-escuro"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Adicionar horário</span>
                </button>
              </div>

              {/* Teleconsulta */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="teleconsultation"
                    checked={formData.teleconsultation}
                    onChange={(e) => setFormData({...formData, teleconsultation: e.target.checked})}
                    className="w-4 h-4 text-verde-cia"
                  />
                  <label htmlFor="teleconsultation" className="ml-2 text-sm font-medium text-gray-700">
                    Ofereço teleconsulta
                  </label>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="md:col-span-2 mt-8 flex justify-end space-x-4">
                <Link
                  to="/especialista/dashboard"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro disabled:opacity-70 flex items-center"
                >
                  {saving && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>}
                  <Save className="w-5 h-5 mr-2" />
                  <span>Salvar Perfil</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor; 