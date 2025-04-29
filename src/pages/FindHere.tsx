import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Video, Activity, Heart, Home, Users, Building2, UserCheck, AlertTriangle } from 'lucide-react';
import HeroParallax from '@/components/HeroParallax';
import SpecialistCard from '@/components/SpecialistCard';
import ExamCard from '@/components/ExamCard';
import { 
  specialists, 
  exams, 
  filterSpecialists, 
  filterExams,
  getAllSpecialties,
  getAllCities,
  getAllSpecialists,
  getAllExams
} from '@/data/specialists';
import { Specialist, Exam } from '@/lib/types';

type Category = 'consultations' | 'teleconsultations' | 'exams' | 'physiotherapy' | 'home-doctor' | 'home-nurse' | 'elderly-home' | 'elderly-care';
type SubFilter = 'specialty' | 'city' | 'specialist' | 'clinic' | 'company' | 'individual';

interface CategoryConfig {
  icon: React.ElementType;
  label: string;
  filters: {
    id: string;
    label: string;
    type: SubFilter;
    options: string[];
  }[];
}

const FindHere = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    specialists: Specialist[];
    exams: Exam[];
  }>({
    specialists: [],
    exams: []
  });
  const [hasSearched, setHasSearched] = useState(false);
  
  // Dynamically build categories with real data
  const [categories, setCategories] = useState<Record<Category, CategoryConfig>>({
    'consultations': {
      icon: Activity,
      label: 'Consultas',
      filters: [
        {
          id: 'specialty',
          label: 'Especialidades (A a Z)',
          type: 'specialty',
          options: []
        },
        {
          id: 'city',
          label: 'Cidade do DF',
          type: 'city',
          options: []
        },
        {
          id: 'specialist',
          label: 'Especialistas (A a Z)',
          type: 'specialist',
          options: []
        }
      ]
    },
    'teleconsultations': {
      icon: Video,
      label: 'Teleconsultas',
      filters: [
        {
          id: 'specialty',
          label: 'Especialidades',
          type: 'specialty',
          options: []
        },
        {
          id: 'specialist',
          label: 'Especialistas',
          type: 'specialist',
          options: []
        }
      ]
    },
    'exams': {
      icon: Heart,
      label: 'Exames',
      filters: [
        {
          id: 'specialty',
          label: 'Especialidades (A a Z)',
          type: 'specialty',
          options: []
        },
        {
          id: 'clinic',
          label: 'Cidades do DF / Clínicas',
          type: 'clinic',
          options: []
        }
      ]
    },
    'physiotherapy': {
      icon: Activity,
      label: 'Fisioterapia',
      filters: [
        {
          id: 'city',
          label: 'Cidade do DF',
          type: 'city',
          options: []
        },
        {
          id: 'specialist',
          label: 'Especialistas (A a Z)',
          type: 'specialist',
          options: []
        }
      ]
    },
    'home-doctor': {
      icon: Home,
      label: 'Médico Domiciliar',
      filters: [
        {
          id: 'specialty',
          label: 'Especialidade',
          type: 'specialty',
          options: []
        },
        {
          id: 'specialist',
          label: 'Especialistas',
          type: 'specialist',
          options: []
        }
      ]
    },
    'home-nurse': {
      icon: UserCheck,
      label: 'Enfermeiro Domiciliar',
      filters: [
        {
          id: 'type',
          label: 'Empresa / Pessoa Física',
          type: 'company',
          options: ['Empresa', 'Pessoa Física']
        }
      ]
    },
    'elderly-home': {
      icon: Building2,
      label: 'Casa de Idosos',
      filters: [
        {
          id: 'city',
          label: 'Cidade do DF',
          type: 'city',
          options: []
        }
      ]
    },
    'elderly-care': {
      icon: Users,
      label: 'Cuidadores de Idosos',
      filters: [
        {
          id: 'type',
          label: 'Empresa / Pessoa Física',
          type: 'company',
          options: ['Empresa', 'Pessoa Física']
        }
      ]
    }
  });

  // Load filter options from data
  useEffect(() => {
    const allSpecialties = getAllSpecialties();
    const allCities = getAllCities();
    const allSpecialists = getAllSpecialists();
    
    setCategories(prev => {
      const updated = { ...prev };
      
      // Update consultations category
      updated.consultations.filters[0].options = allSpecialties;
      updated.consultations.filters[1].options = allCities;
      updated.consultations.filters[2].options = allSpecialists;
      
      // Update teleconsultations category
      updated.teleconsultations.filters[0].options = allSpecialties;
      updated.teleconsultations.filters[1].options = allSpecialists.filter(name => 
        specialists.find(s => s.name === name && s.teleconsultation)
      );
      
      // Update exams category
      updated.exams.filters[0].options = allSpecialties;
      updated.exams.filters[1].options = allCities;
      
      // Update physiotherapy category
      updated.physiotherapy.filters[0].options = allCities;
      updated.physiotherapy.filters[1].options = allSpecialists.filter(name => 
        specialists.find(s => s.name === name && s.specialty === 'Fisioterapia')
      );
      
      // Update home-doctor category
      updated['home-doctor'].filters[0].options = allSpecialties;
      updated['home-doctor'].filters[1].options = allSpecialists.filter(name => 
        specialists.find(s => s.name === name && s.consultationType === 'domiciliar')
      );
      
      // Update elderly-home category
      updated['elderly-home'].filters[0].options = allCities;
      
      return updated;
    });
  }, []);

  const handleFilterChange = (filterId: string, value: string) => {
    setSelectedFilters(prev => {
      // If value is empty, remove the filter
      if (!value) {
        const newFilters = { ...prev };
        delete newFilters[filterId];
        return newFilters;
      }
      
      // Otherwise, set the filter value
      return {
        ...prev,
        [filterId]: [value] // Using array for future multi-select support
      };
    });
  };

  const handleSearch = () => {
    let filteredSpecialists: Specialist[] = [];
    let filteredExams: Exam[] = [];
    
    if (selectedCategory === 'exams') {
      filteredExams = filterExams(selectedFilters, searchTerm);
    } else {
      filteredSpecialists = filterSpecialists(selectedCategory, selectedFilters, searchTerm);
    }
    
    setSearchResults({
      specialists: filteredSpecialists,
      exams: filteredExams
    });
    
    setHasSearched(true);
  };

  // Auto-search when category is selected and no other filters are needed
  useEffect(() => {
    if (selectedCategory && 
        (selectedCategory === 'home-nurse' || 
         selectedCategory === 'elderly-home' || 
         selectedCategory === 'elderly-care' ||
         searchTerm.length > 2)) {
      handleSearch();
    }
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroParallax
        title="Encontre Aqui"
        description="Encontre o profissional ou serviço ideal para suas necessidades"
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000"
        typeSequence={[
          'Consultas Médicas',
          2000,
          'Teleconsultas',
          2000,
          'Exames',
          2000,
          'Cuidados Especializados',
          2000
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 -mt-20 relative z-10">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Busque por especialidade, profissional ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-verde-cia focus:border-transparent"
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.entries(categories) as [Category, CategoryConfig][]).map(([key, category]) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === key ? null : key);
                    setSelectedFilters({});
                    setHasSearched(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === key
                      ? 'border-verde-cia bg-verde-cia/5'
                      : 'border-gray-200 hover:border-verde-cia/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <category.icon className={`w-6 h-6 mb-2 ${
                      selectedCategory === key ? 'text-verde-cia' : 'text-gray-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedCategory === key ? 'text-verde-cia' : 'text-gray-700'
                    }`}>
                      {category.label}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Filters */}
            <AnimatePresence>
              {selectedCategory && categories[selectedCategory].filters.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories[selectedCategory].filters.map((filter) => (
                      <div key={filter.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {filter.label}
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-verde-cia focus:border-transparent"
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          value={selectedFilters[filter.id]?.[0] || ''}
                        >
                          <option value="">Selecione...</option>
                          {filter.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSearch}
                      className="px-6 py-2 bg-verde-cia text-white rounded-lg hover:bg-verde-cia-escuro transition-colors flex items-center"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Buscar
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {hasSearched && (
          <>
            {selectedCategory === 'exams' ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Exames Encontrados ({searchResults.exams.length})</h2>
                {searchResults.exams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.exams.map(exam => (
                      <ExamCard key={exam.id} exam={exam} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg flex items-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                    <p>Nenhum exame encontrado com os critérios selecionados.</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Especialistas Encontrados ({searchResults.specialists.length})</h2>
                {searchResults.specialists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.specialists.map(specialist => (
                      <SpecialistCard key={specialist.id} specialist={specialist} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-6 rounded-lg flex items-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
                    <p>Nenhum especialista encontrado com os critérios selecionados.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
        
        {!hasSearched && selectedCategory && (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecione os filtros desejados e clique em "Buscar" para encontrar resultados.</p>
          </div>
        )}
        
        {!selectedCategory && !hasSearched && (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecione uma categoria acima para começar sua busca.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default FindHere;