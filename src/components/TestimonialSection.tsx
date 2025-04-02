import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    role: 'Paciente',
    image: 'https://i.pravatar.cc/150?img=1',
    content: 'Encontrei o médico perfeito para minha condição através do Anuário de Saúde. O processo foi simples e rápido!',
    rating: 5
  },
  {
    id: 2,
    name: 'João Santos',
    role: 'Paciente',
    image: 'https://i.pravatar.cc/150?img=3',
    content: 'Excelente plataforma! Consegui agendar uma consulta com um especialista renomado no mesmo dia.',
    rating: 5
  },
  {
    id: 3,
    name: 'Ana Costa',
    role: 'Médica',
    image: 'https://i.pravatar.cc/150?img=5',
    content: 'Como profissional de saúde, o Anuário me ajudou a expandir minha base de pacientes e organizar melhor minha agenda.',
    rating: 4
  },
  {
    id: 4,
    name: 'Carlos Oliveira',
    role: 'Paciente',
    image: 'https://i.pravatar.cc/150?img=8',
    content: 'Plataforma intuitiva e com informações detalhadas sobre os médicos. Recomendo a todos!',
    rating: 5
  },
  {
    id: 5,
    name: 'Fernanda Lima',
    role: 'Nutricionista',
    image: 'https://i.pravatar.cc/150?img=9',
    content: 'O Anuário de Saúde revolucionou minha prática profissional. Agora tenho mais visibilidade e pacientes.',
    rating: 5
  }
];

const TestimonialSection = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: 3,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 16 },
      },
    },
  });

  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia/5 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            O Que Dizem Sobre Nós
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja o que nossos usuários e profissionais de saúde estão falando sobre o Anuário de Saúde
          </p>
        </motion.div>

        <div ref={sliderRef} className="keen-slider">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="keen-slider__slide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                <div className="flex-1 relative">
                  <Quote className="w-8 h-8 text-gray-200 absolute -top-2 -left-2 transform -scale-x-100" />
                  <p className="text-gray-600 relative z-10 pl-2">{testimonial.content}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;