import React from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, User, DollarSign, Info } from 'lucide-react';
import { Exam } from '../lib/types';

interface ExamCardProps {
  exam: Exam;
  onClick?: () => void;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{exam.name}</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              <span>{exam.specialistName}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-gray-400" />
              <span>{exam.location}</span>
            </div>
            
            {exam.price && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                <span>{exam.price}</span>
              </div>
            )}
          </div>
          
          {exam.description && (
            <div className="text-sm text-gray-600 border-t pt-3">
              <div className="flex items-start">
                <Info className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                <p>{exam.description}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-verde-cia text-white py-2 rounded-lg hover:bg-verde-cia-escuro transition-colors"
            >
              Agendar Exame
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCard;