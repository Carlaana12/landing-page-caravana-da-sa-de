import React, { useState } from 'react';
import { Filter, Search, X, Calendar, Tag, CheckSquare } from 'lucide-react';

interface ContentFiltersProps {
  onSearch: (term: string) => void;
  onFilterStatus: (status: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterDate: (date: string) => void;
  onResetFilters: () => void;
  statusOptions: { value: string; label: string }[];
  categoryOptions: { value: string; label: string }[];
}

const ContentFilters: React.FC<ContentFiltersProps> = ({
  onSearch,
  onFilterStatus,
  onFilterCategory,
  onFilterDate,
  onResetFilters,
  statusOptions,
  categoryOptions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedDate, setSelectedDate] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);
    onFilterStatus(value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onFilterCategory(value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedDate(value);
    onFilterDate(value);
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedStatus('todos');
    setSelectedCategory('todos');
    setSelectedDate('');
    onResetFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Campo de pesquisa */}
        <div className="flex-1 relative rounded-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-verde-cia focus:border-verde-cia block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2 pr-4"
            placeholder="Pesquisar conteúdo..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Botão de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-3 py-2 rounded-lg border ${
            showFilters ? 'bg-verde-cia text-white border-verde-cia' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          } transition-colors`}
        >
          <Filter className="h-5 w-5 mr-2" />
          Filtros
          <svg 
            className={`ml-1 w-4 h-4 transition-transform duration-200 ${showFilters ? 'transform rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Painel de filtros expansível */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Filtro de Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CheckSquare className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-verde-cia focus:ring-verde-cia"
              >
                <option value="todos">Todos os status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtro de Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-verde-cia focus:ring-verde-cia"
              >
                <option value="todos">Todas as categorias</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtro de Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-verde-cia focus:ring-verde-cia"
              />
            </div>
          </div>
          
          {/* Botão para limpar filtros */}
          <div className="sm:col-span-3 flex justify-end mt-2">
            <button
              onClick={resetAllFilters}
              className="text-sm text-gray-600 flex items-center hover:text-gray-900 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFilters; 