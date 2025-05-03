import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import PatientLayout from '../../components/patient/PatientLayout';

const MedicalHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('medical_history')
        .select(`
          *,
          doctor:doctor_id (
            name,
            specialty
          )
        `)
        .eq('patient_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(record =>
    record.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Histórico Médico</h1>
            <p className="text-gray-600">Acompanhe seu histórico de consultas e tratamentos</p>
          </header>

          {/* Filtro de Busca */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por médico, especialidade ou diagnóstico"
                className="w-full px-3 py-2 border rounded-md pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Lista de Registros */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-verde-cia"></div>
              </div>
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {record.doctor.name}
                        </h3>
                        <p className="text-verde-cia">{record.doctor.specialty}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Diagnóstico</h4>
                      <p className="mt-1 text-gray-600">{record.diagnosis}</p>
                    </div>

                    {record.prescription && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Prescrição</h4>
                        <p className="mt-1 text-gray-600">{record.prescription}</p>
                      </div>
                    )}

                    {record.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Observações</h4>
                        <p className="mt-1 text-gray-600">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum registro encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default MedicalHistory; 