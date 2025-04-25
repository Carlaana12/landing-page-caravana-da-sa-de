import { useEffect, useRef } from 'react';

const ads = [
  "Marketing digital de impacto; Especialistas apenas do DF",
  "Conectando com pacientes do DF e Entorno",
  "Expandindo seus serviços e conhecimentos",
  "Criamos o seu webSite profissional e logomarca",
  "Em tecnologia 3D e IA",
  "Aplicativos, criativos e ultramodernos",
  "Trabalhamos diariamente para divulgar seus serviços",
  "Excelência e garantia de qualidade",
  "Seja nosso parceiro",
  "Planos anuais e semestrais; Flexíveis e de baixo custo"
];

const AdBanner = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number>();

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        if (
          scrollRef.current.scrollLeft >=
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 0.5;
        }
      }
    };

    let animationFrameId: number;
    const animate = () => {
      scroll();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="bg-verde-cia text-white py-2 overflow-hidden">
      <div
        ref={scrollRef}
        className="whitespace-nowrap"
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <div className="inline-block animate-marquee">
          {[...ads, ...ads].map((ad, index) => (
            <span
              key={index}
              className="inline-block mx-8 text-sm font-medium italic uppercase"
            >
              {ad}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
