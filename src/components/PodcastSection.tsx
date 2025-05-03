import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

const PodcastSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <section className="py-16 bg-gradient-to-br from-verde-cia/5 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 bg-verde-cia rounded-full flex items-center justify-center"
            >
              <Radio className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Podcast Saúde & Bem-estar
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acompanhe nosso podcast com dicas, entrevistas e informações sobre saúde
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Episode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div 
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <iframe
                src="https://player.vimeo.com/video/735428933?h=8c0a0c0a0c&autoplay=1&loop=1&muted=1"
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* Episodes List */}
          <div className="space-y-4">
            {[1, 2, 3].map((episode) => (
          <motion.div
                key={episode}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: episode * 0.1 }}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedEpisode === episode
                    ? 'bg-verde-cia text-white'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedEpisode(episode)}
              >
                <h3 className="font-semibold mb-1">Episódio {episode}</h3>
                <p className="text-sm opacity-80">
                  Título do episódio {episode} - Descrição breve do conteúdo
                </p>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;