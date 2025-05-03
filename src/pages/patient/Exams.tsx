import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Calendar, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import PatientLayout from '../../components/patient/PatientLayout';

const Exams = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('patient_exams')
        .select('*')
        .eq('patient_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      toast.error('Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluído':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Meus Exames</h1>
            <p className="text-gray-600">Acompanhe seus exames e resultados</p>
          </header>

          {/* Filtro de Busca */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, tipo ou status do exame"
                className="w-full px-3 py-2 border rounded-md pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Lista de Exames */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-verde-cia"></div>
              </div>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {exam.name}
                        </h3>
                        <p className="text-gray-600">{exam.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Data: {new Date(exam.date).toLocaleDateString()}</span>
                    </div>

                    {exam.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">{exam.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => window.open(exam.file_url, '_blank')}
                        className="flex items-center text-verde-cia hover:text-verde-cia-escuro"
                      >
                        <Eye className="w-5 h-5 mr-1" />
                        <span>Visualizar</span>
                      </button>
                      <button
                        onClick={() => window.open(exam.file_url, '_blank')}
                        className="flex items-center text-verde-cia hover:text-verde-cia-escuro"
                      >
                        <Download className="w-5 h-5 mr-1" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum exame encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Exams; 