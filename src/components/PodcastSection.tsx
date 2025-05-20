import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause, Volume2, VolumeX, Clock, Calendar, Volume1, SkipBack, SkipForward, Maximize2, Minimize2, Heart, Star, Shield, Activity } from 'lucide-react';
import ReactPlayer from 'react-player';

const podcasts = [
  {
    id: 1,
    title: "Saúde Mental no Trabalho",
    description: "Como manter a saúde mental em um ambiente corporativo exigente",
    type: "youtube",
    videoId: "tQebuafo1ns",
    duration: "12 min",
    date: "15 Mar 2024",
    thumbnail: "https://img.youtube.com/vi/tQebuafo1ns/maxresdefault.jpg"
  },
  {
    id: 2,
    title: "Alimentação Saudável",
    description: "Dicas práticas para uma alimentação equilibrada no dia a dia",
    type: "youtube",
    videoId: "X71YbXctXeM",
    duration: "8 min",
    date: "10 Mar 2024",
    thumbnail: "https://img.youtube.com/vi/X71YbXctXeM/maxresdefault.jpg"
  },
  {
    id: 3,
    title: "Exercícios em Casa",
    description: "Rotinas de exercícios para fazer em casa sem equipamentos",
    type: "youtube",
    videoId: "ml6cT4AZdqI",
    duration: "15 min",
    date: "5 Mar 2024",
    thumbnail: "https://img.youtube.com/vi/ml6cT4AZdqI/maxresdefault.jpg"
  }
];

function getYoutubeId(url: string) {
  // Extrai o ID do vídeo do YouTube a partir do link
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[1].length === 11) ? match[1] : null;
}

const phrases = [
  { text: "Cuide da sua saúde hoje para um amanhã melhor", icon: Heart },
  { text: "Prevenção é o melhor remédio", icon: Shield },
  { text: "Sua saúde em primeiro lugar", icon: Star },
  { text: "Especialistas prontos para cuidar de você", icon: Activity },
  { text: "Qualidade de vida começa com saúde", icon: Heart }
];

const PodcastSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(0.5);
    } else {
      setVolume(0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.currentTarget.value));
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const skipForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 10, 'seconds');
    }
  };

  const skipBackward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 10, 'seconds');
    }
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const selectedPodcast = podcasts.find(p => p.id === selectedEpisode);

  const getVideoUrl = (podcast: typeof podcasts[0]) => {
    if (podcast.type === 'youtube') {
      return `https://www.youtube.com/watch?v=${podcast.videoId}`;
    }
    return `https://vimeo.com/${podcast.videoId}`;
  };

  const getThumbnailUrl = (podcast: typeof podcasts[0]) => {
    if (podcast.type === 'youtube') {
      return `https://img.youtube.com/vi/${podcast.videoId}/maxresdefault.jpg`;
    }
    return `https://vumbnail.com/${podcast.videoId}.jpg`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  const handleReady = () => {
    setIsReady(true);
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player && player.setPlaybackQuality) {
        player.setPlaybackQuality('hd720');
      }
    }
  };

  return (
    <section className="py-16">
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
              className="w-16 h-16 bg-gradient-to-br from-verde-cia to-verde-cia/80 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Radio className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4 shine-text">
            Podcast Saúde & Bem-estar
          </h2>
          <p className="text-white max-w-2xl mx-auto text-lg">
            Acompanhe nosso podcast com dicas, entrevistas e informações sobre saúde
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
          {/* Featured Episode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
                  ref={containerRef}
                  className="relative aspect-video rounded-t-xl overflow-hidden bg-black"
              onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => {
                    setIsHovered(false);
                    setShowVolumeSlider(false);
                  }}
                  onMouseMove={handleMouseMove}
                >
                  <ReactPlayer
                    ref={playerRef}
                    url={selectedPodcast ? getVideoUrl(selectedPodcast) : ''}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    volume={volume}
                    muted={isMuted}
                    controls={false}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onBuffer={handleBuffer}
                    onBufferEnd={handleBufferEnd}
                    onReady={handleReady}
                    config={{
                      youtube: {
                        playerVars: { 
                          showinfo: 0,
                          modestbranding: 1,
                          rel: 0,
                          hd: 1,
                          vq: 'hd720',
                          playsinline: 1,
                          fs: 0,
                          iv_load_policy: 3,
                          cc_load_policy: 0,
                          origin: window.location.origin,
                          controls: 0,
                          disablekb: 1,
                          enablejsapi: 1,
                          widget_referrer: window.location.origin
                        }
                      },
                      vimeo: {
                        playerOptions: { 
                          byline: false, 
                          portrait: false,
                          title: false,
                          quality: '720p',
                          dnt: true,
                          playsinline: true,
                          background: false,
                          pip: false,
                          controls: false
                        }
                      },
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                          disablePictureInPicture: true
                        }
                      }
                    }}
                  />

                  {/* Overlay de Buffering */}
                  {isBuffering && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-verde-cia border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Controles Personalizados */}
                  {(isHovered || !isPlaying || showControls) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between">
                      {/* Barra de Progresso */}
                      <div className="w-full px-4 pt-4">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step="any"
                          value={played}
                          onMouseDown={handleSeekMouseDown}
                          onChange={handleSeekChange}
                          onMouseUp={handleSeekMouseUp}
                          className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
                          }}
                        />
                      </div>

                      {/* Controles */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={togglePlayPause}
                              className="w-12 h-12 bg-verde-cia rounded-full flex items-center justify-center text-white hover:bg-verde-cia/90 transition-colors"
                            >
                              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>
                            <button
                              onClick={skipBackward}
                              className="w-10 h-10 bg-verde-cia/80 rounded-full flex items-center justify-center text-white hover:bg-verde-cia/90 transition-colors"
                            >
                              <SkipBack className="w-5 h-5" />
                            </button>
                            <button
                              onClick={skipForward}
                              className="w-10 h-10 bg-verde-cia/80 rounded-full flex items-center justify-center text-white hover:bg-verde-cia/90 transition-colors"
                            >
                              <SkipForward className="w-5 h-5" />
                            </button>
                            <span className="text-white text-sm">
                              {formatTime(played * duration)} / {formatTime(duration)}
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <button
                                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                className="w-10 h-10 bg-verde-cia/80 rounded-full flex items-center justify-center text-white hover:bg-verde-cia/90 transition-colors"
                              >
                                {isMuted ? (
                                  <VolumeX className="w-5 h-5" />
                                ) : volume < 0.5 ? (
                                  <Volume1 className="w-5 h-5" />
                                ) : (
                                  <Volume2 className="w-5 h-5" />
                                )}
                              </button>
                              {showVolumeSlider && (
                                <div className="absolute bottom-12 right-0 bg-black/80 rounded-lg p-2 w-32">
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              onClick={toggleFullscreen}
                              className="w-10 h-10 bg-verde-cia/80 rounded-full flex items-center justify-center text-white hover:bg-verde-cia/90 transition-colors"
                            >
                              {isFullscreen ? (
                                <Minimize2 className="w-5 h-5" />
                              ) : (
                                <Maximize2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{selectedPodcast?.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{selectedPodcast?.date}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedPodcast?.title}</h3>
                  <p className="text-sm text-gray-600">{selectedPodcast?.description}</p>
                </div>
            </div>
          </motion.div>

            {/* Animated Phrases Banner */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-16 bg-gradient-to-r from-verde-cia/10 to-verde-cia/5 overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap">
                    {[...phrases, ...phrases].map((phrase, index) => (
                      <div key={index} className="flex items-center space-x-4 text-verde-cia">
                        <phrase.icon className="w-5 h-5" />
                        <span className="text-lg font-medium">{phrase.text}</span>
                        <div className="w-2 h-2 rounded-full bg-verde-cia/50" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent" />
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="lg:col-span-4 space-y-3">
            {podcasts.map((podcast) => (
          <motion.div
                key={podcast.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: podcast.id * 0.1 }}
                className={`bg-white rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  selectedEpisode === podcast.id
                    ? 'ring-2 ring-verde-cia'
                    : 'hover:translate-x-1'
                }`}
                onClick={() => {
                  setSelectedEpisode(podcast.id);
                  setIsPlaying(false);
                }}
              >
                <div className="p-3">
                  <div className="relative h-28 mb-2 rounded-lg overflow-hidden group">
                    <img
                      src={getThumbnailUrl(podcast)}
                      alt={podcast.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (podcast.type === 'youtube') {
                          target.src = `https://img.youtube.com/vi/${podcast.videoId}/hqdefault.jpg`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-verde-cia rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded-full">
                          {podcast.duration}
                        </span>
                        <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded-full">
                          {podcast.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">{podcast.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {podcast.description}
                  </p>
                </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastSection;