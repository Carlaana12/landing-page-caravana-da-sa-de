import React, { useState } from 'react';
import { useAdminContacts } from '@/hooks/useAdminContacts';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

const AdminContacts: React.FC = () => {
  const { contacts, loading } = useAdminContacts();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    telefone: '',
    email: '',
    endereco: '',
    horario: '',
    ordem: 1
  });

  React.useEffect(() => {
    if (contacts && contacts.length > 0) {
      setFormData({
        telefone: contacts[0].telefone || '',
        email: contacts[0].email || '',
        endereco: contacts[0].endereco || '',
        horario: contacts[0].horario || '',
        ordem: contacts[0].ordem || 1
      });
    }
  }, [contacts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (contacts && contacts.length > 0) {
        // Atualizar contato existente
        const { error } = await supabase
          .from('admin_contacts')
          .update(formData)
          .eq('id', contacts[0].id);

        if (error) throw error;
        toast.success('Contatos atualizados com sucesso!');
      } else {
        // Criar novo contato
        const { error } = await supabase
          .from('admin_contacts')
          .insert([formData]);

        if (error) throw error;
        toast.success('Contatos criados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar contatos:', error);
      toast.error('Erro ao salvar contatos. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Gerenciar Contatos</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="tel"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
            placeholder="(00) 00000-0000"
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
            placeholder="contato@exemplo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço
          </label>
          <input
            type="text"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
            placeholder="Rua Exemplo, 123 - Cidade/UF"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Atendimento
          </label>
          <input
            type="text"
            value={formData.horario}
            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
            placeholder="Segunda a Sexta, das 8h às 18h"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordem de Exibição
          </label>
          <input
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
            min="1"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-verde-cia hover:bg-verde-cia-escuro text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default AdminContacts; 