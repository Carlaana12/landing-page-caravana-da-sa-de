import React, { useEffect, useRef } from 'react';

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Configuração para tela cheia
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Desenhar linha de ECG (eletrocardiograma)
    const drawECGLine = (x: number, y: number, width: number, height: number, time: number, opacity: number) => {
      const ecgWidth = width;
      const ecgHeight = height;
      const speed = 0.2;
      
      ctx.strokeStyle = `rgba(70, 180, 100, ${opacity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Linha base
      ctx.moveTo(x, y + ecgHeight / 2);
      
      // Desenhar padrão de ECG
      for (let i = 0; i < ecgWidth; i += 1) {
        const progress = (i / ecgWidth + time * speed) % 1;
        let yOffset = 0;
        
        // Formato de um batimento cardíaco típico
        if (progress > 0.1 && progress < 0.12) {
          yOffset = -ecgHeight * 0.2 * ((progress - 0.1) / 0.02);
        } else if (progress >= 0.12 && progress < 0.14) {
          yOffset = -ecgHeight * 0.2 * (1 - (progress - 0.12) / 0.02);
        } else if (progress > 0.14 && progress < 0.16) {
          yOffset = ecgHeight * 0.5 * ((progress - 0.14) / 0.02);
        } else if (progress >= 0.16 && progress < 0.18) {
          yOffset = ecgHeight * 0.5 * (1 - (progress - 0.16) / 0.02);
        } else if (progress > 0.18 && progress < 0.2) {
          yOffset = -ecgHeight * 0.2 * ((progress - 0.18) / 0.02);
        } else if (progress >= 0.2 && progress < 0.22) {
          yOffset = -ecgHeight * 0.2 * (1 - (progress - 0.2) / 0.02);
        }
        
        ctx.lineTo(x + i, y + ecgHeight / 2 + yOffset);
      }
      
      ctx.stroke();
    };

    // Desenhar linha de pulso animada que se move pela tela
    const drawAnimatedPulse = (time: number) => {
      const pulseWidth = canvas.width * 0.4;
      const pulseHeight = 40;
      
      // Posição X que se move da esquerda para a direita
      const cycleTime = 8; // segundos para completar um ciclo
      const normalizedTime = (time % cycleTime) / cycleTime;
      const startX = -pulseWidth + normalizedTime * (canvas.width + pulseWidth * 2);
      
      // Y aleatório mas consistente para cada ciclo
      const cycleIndex = Math.floor(time / cycleTime);
      const seedY = Math.sin(cycleIndex * 7919); // Número primo para pseudoaleatoriedade
      const y = canvas.height * (0.3 + seedY * 0.3);
      
      // Desenhar com efeito de brilho
      ctx.save();
      
      // Sombra para efeito de brilho
      ctx.shadowColor = 'rgba(80, 190, 110, 0.6)';
      ctx.shadowBlur = 10;
      
      // Desenhar a linha de pulso
      ctx.strokeStyle = 'rgba(80, 200, 120, 0.8)';
      ctx.lineWidth = 2;
      
      drawECGLine(startX, y, pulseWidth, pulseHeight, time, 0.8);
      
      ctx.restore();
    };

    // Função de animação principal
    const animate = () => {
      time += 0.005;
      
      // Limpar canvas com fundo gradiente verde médio
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#5da378');
      gradient.addColorStop(1, '#4a8e64');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar linha de batimento cardíaco na parte superior
      drawECGLine(0, canvas.height * 0.15, canvas.width, 80, time + 0.3, 0.9);
      
      // Desenhar linha de batimento cardíaco principal - na parte inferior
      drawECGLine(0, canvas.height * 0.85, canvas.width, 80, time, 0.9);
      
      // Desenhar linha de pulso animada que se move pela tela
      drawAnimatedPulse(time);
      
      // Continuar loop de animação
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Iniciar animação
    animate();
    
    // Limpeza
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
        style={{ filter: 'contrast(1.05) saturate(1.1)' }}
      />
    </div>
  );
};

export default DynamicBackground; 