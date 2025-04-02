import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Mic,
  Headphones,
  Radio,
  Clock,
  Calendar,
  Share2
} from 'lucide-react';

const episodes = [
  {
    id: 1,
    title: "Saúde Mental no Ambiente de Trabalho",
    guest: "Dra. Maria Silva",
    duration: "45 min",
    date: "15 Mar 2024",
    description: "Discussão sobre o impacto do trabalho na saúde mental e estratégias de bem-estar.",
    topics: ["Estresse", "Burnout", "Equilíbrio"],
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500"
  },
  {
    id: 2,
    title: "Nutrição e Qualidade de Vida",
    guest: "Dr. João Santos",
    duration: "38 min",
    date: "22 Mar 2024",
    description: "Como uma alimentação equilibrada pode transformar sua saúde.",
    topics: ["Alimentação", "Bem-estar", "Energia"],
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500"
  },
  {
    id: 3,
    title: "Tecnologia na Medicina Moderna",
    guest: "Dr. Pedro Costa",
    duration: "42 min",
    date: "29 Mar 2024",
    description: "Os avanços tecnológicos que estão revolucionando a medicina.",
    topics: ["Inovação", "IA", "Futuro"],
    thumbnail: "https://images.unsplash.com/photo-1576091160291-31957ab2724f?auto=format&fit=crop&w=500"
  }
];

const PodcastSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isMuted, isPlaying]);

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
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                playsInline
                src="https://player.vimeo.com/progressive_redirect/playback/735428933/rendition/720p/file.mp4"
              />
              
              {/* Video Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
              >
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlayPause}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-verde-cia hover:bg-gray-100 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMute}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </motion.button>

                    <div className="flex-1" />

                    <motion.a
                      href="https://www.youtube.com/@AnuariodeSaude"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center text-white hover:text-verde-cia transition-colors"
                    >
                      <span className="mr-2">Assistir no YouTube</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">
                      Episódio em Destaque
                    </h3>
                    <p className="text-white/80">
                      Assista ao vivo ou acesse nosso canal para mais conteúdo
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Episodes List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Últimos Episódios</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-verde-cia hover:text-verde-cia-escuro"
              >
                Ver todos
              </motion.button>
            </div>

            <div className="space-y-4">
              {episodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedEpisode(episode.id)}
                >
                  <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-verde-cia/5 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={episode.thumbnail}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold group-hover:text-verde-cia transition-colors">
                          {episode.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          com {episode.guest}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{episode.duration}</span>
                          <span className="mx-2">•</span>
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{episode.date}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 bg-verde-cia text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Mic className="w-4 h-4 mr-1" />
                  <span>42 Episódios</span>
                </div>
                <div className="flex items-center">
                  <Headphones className="w-4 h-4 mr-1" />
                  <span>+10k Ouvintes</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;