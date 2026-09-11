import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
}

interface CircuitTrace {
  points: { x: number; y: number }[];
  progress: number;
  speed: number;
  color: string;
  width: number;
}

export const HeroCircuitAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const gridSize = 45;
    const colors = ['#561269', '#FF6B00', '#a855f7', '#10b981', '#dfb5e9'];

    // Generate circuit traces
    const traces: CircuitTrace[] = [];
    const numTraces = 18;

    const createTrace = (): CircuitTrace => {
      const startX = Math.floor((Math.random() * width) / gridSize) * gridSize;
      const startY = Math.floor((Math.random() * height) / gridSize) * gridSize;
      const points = [{ x: startX, y: startY }];
      
      let curX = startX;
      let curY = startY;
      const segments = 3 + Math.floor(Math.random() * 5);

      for (let i = 0; i < segments; i++) {
        const goHorizontal = Math.random() > 0.45;
        const length = (1 + Math.floor(Math.random() * 3)) * gridSize;
        const dir = Math.random() > 0.5 ? 1 : -1;

        if (goHorizontal) {
          curX += length * dir;
        } else {
          curY += length * dir;
        }
        points.push({ x: curX, y: curY });
      }

      return {
        points,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.007,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 1.2 + Math.random() * 1.5,
      };
    };

    for (let i = 0; i < numTraces; i++) {
      traces.push(createTrace());
    }

    // Floating digital energy spark particles
    const particles: Particle[] = [];
    const numParticles = 35;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.2 + Math.random() * 0.6,
        size: 1 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.7,
        color: Math.random() > 0.5 ? '#00f0ff' : '#FF6B00',
      });
    }

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle PCB Grid Dots & Integrated Micro Nodes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = gridSize; x < width; x += gridSize) {
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Live Oscilloscope Sine Wave at bottom
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 4) {
        const waveY = height - 40 + Math.sin(x * 0.015 + time * 2) * 12 + Math.cos(x * 0.03 + time) * 6;
        if (x === 0) ctx.moveTo(x, waveY);
        else ctx.lineTo(x, waveY);
      }
      ctx.stroke();

      // 3. Draw Circuit Traces & High-Speed Electric Packets
      traces.forEach((trace, idx) => {
        trace.progress += trace.speed;
        if (trace.progress >= 1) {
          traces[idx] = createTrace();
          return;
        }

        const pts = trace.points;
        if (pts.length < 2) return;

        // Trace base line
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = trace.width;
        ctx.stroke();

        // Terminal solder pads
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, 2.5, 0, Math.PI * 2);
        ctx.arc(pts[pts.length - 1].x, pts[pts.length - 1].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.fill();

        // Calculate current position of electric pulse
        const totalSegments = pts.length - 1;
        const currentSegmentIndex = Math.min(
          Math.floor(trace.progress * totalSegments),
          totalSegments - 1
        );
        const segmentProgress =
          (trace.progress * totalSegments) - currentSegmentIndex;

        const p1 = pts[currentSegmentIndex];
        const p2 = pts[currentSegmentIndex + 1];

        if (p1 && p2) {
          const pulseX = p1.x + (p2.x - p1.x) * segmentProgress;
          const pulseY = p1.y + (p2.y - p1.y) * segmentProgress;

          // Electric neon glow pulse
          const grad = ctx.createRadialGradient(
            pulseX,
            pulseY,
            0,
            pulseX,
            pulseY,
            14
          );
          grad.addColorStop(0, trace.color);
          grad.addColorStop(0.35, trace.color);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 14, 0, Math.PI * 2);
          ctx.fill();

          // Bright center laser core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Floating Micro-particles
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(time * 2 + p.x));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Background Interactive Electronic Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block opacity-85" />

      {/* Cyber Electronic HUD Coordinates & Hex Overlays */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="neonGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cb89dc" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#561269" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Top-Left Cyber Circuit Tracks */}
        <path
          d="M0,35 L140,35 L180,75 L380,75"
          fill="none"
          stroke="url(#neonGradCyan)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <circle cx="380" cy="75" r="3.5" fill="#561269" />

        {/* Bottom-Right High-Voltage Circuit Tracks */}
        <path
          d="M 600,420 L 720,420 L 770,370 L 900,370"
          fill="none"
          stroke="url(#neonGradCyan)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <circle cx="600" cy="420" r="3.5" fill="#FF6B00" />
      </svg>

      {/* Large Cyber Electronic Background Watermark (Similar to "2026 FIFA" in reference image) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none select-none opacity-8 font-mono font-black text-white leading-none z-0 tracking-tighter text-[110px] sm:text-[150px] hidden md:block">
        2026
      </div>

      {/* Ambient Silicon Glow Lights */}
      <div className="absolute -top-28 left-1/4 w-96 h-96 bg-[#561269]/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full h-40 bg-gradient-to-t from-[#380847]/80 to-transparent"></div>
    </div>
  );
};
