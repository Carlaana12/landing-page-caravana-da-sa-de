import React from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
  avatar: string;
}

interface DoctorReviewsProps {
  doctorName: string;
  rating: number;
  reviewCount: number;
}

const DoctorReviews: React.FC<DoctorReviewsProps> = ({ doctorName, rating, reviewCount }) => {
  // Generate sample reviews
  const generateReviews = (): Review[] => {
    const reviews: Review[] = [];
    const firstNames = ['Ana', 'Carlos', 'Maria', 'João', 'Fernanda', 'Pedro', 'Juliana', 'Rafael'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Pereira', 'Almeida'];
    const comments = [
      `Excelente profissional! ${doctorName.split(' ')[0]} foi muito atencioso e explicou tudo detalhadamente. Recomendo!`,
      'Atendimento de qualidade, ambiente agradável e equipe muito prestativa.',
      'Consulta rápida e eficiente. Saí com todas as minhas dúvidas esclarecidas.',
      'Profissional extremamente competente e humano. Fez um diagnóstico preciso e o tratamento foi eficaz.',
      'Ótima experiência! Pontualidade no atendimento e explicações claras sobre minha condição.',
      'Médico muito atencioso e dedicado. Recomendo fortemente!',
      'Excelente atendimento, desde a recepção até a consulta. Muito satisfeito.',
      'Profissional competente que realmente se importa com os pacientes.'
    ];
    
    for (let i = 0; i < 8; i++) {
      const randomRating = Math.floor(Math.random() * 2) + 4; // Ratings between 4-5
      const randomName = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
      const randomDays = Math.floor(Math.random() * 60) + 1;
      const randomComment = comments[i % comments.length];
      
      reviews.push({
        id: `review-${i}`,
        name: randomName,
        date: `${randomDays} ${randomDays === 1 ? 'dia' : 'dias'} atrás`,
        rating: randomRating,
        comment: randomComment,
        verified: Math.random() > 0.3, // 70% chance of being verified
        avatar: `https://i.pravatar.cc/150?img=${i + 10}`
      });
    }
    
    return reviews;
  };
  
  const reviews = generateReviews();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Avaliações de Pacientes</h2>
        <div className="flex items-center bg-green-50 px-3 py-1 rounded-lg">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="ml-1 font-semibold">{rating}</span>
          <span className="text-gray-500 text-sm ml-1">
            ({reviewCount} avaliações)
          </span>
        </div>
      </div>
      
      {/* Rating Distribution */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Distribuição das Avaliações</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            // Calculate percentage based on rating distribution
            let percentage = 0;
            if (star === 5) percentage = 75;
            else if (star === 4) percentage = 20;
            else if (star === 3) percentage = 5;
            else percentage = 0;
            
            return (
              <div key={star} className="flex items-center">
                <span className="w-8 text-sm text-gray-600">{star}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-sm text-gray-600">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b pb-4 last:border-0"
          >
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{review.name}</h4>
                    {review.verified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Verificado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            <div className="flex items-center space-x-4 text-sm">
              <button className="flex items-center text-gray-500 hover:text-gray-700">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>Útil</span>
              </button>
              <button className="flex items-center text-gray-500 hover:text-gray-700">
                <Flag className="w-4 h-4 mr-1" />
                <span>Reportar</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button className="text-verde-cia hover:text-verde-cia-escuro font-medium">
        Ver todas as avaliações
      </button>
    </div>
  );
};

export default DoctorReviews;