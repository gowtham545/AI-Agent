import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface CyberPuppyProps {
  className?: string;
}

export const CyberPuppy: React.FC<CyberPuppyProps> = ({
  className = '',
}) => {
  const [isBarking, setIsBarking] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Synthesize a realistic cheerful puppy bark
  const playBark = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const now = ctx.currentTime;
      
      // Main cheerful bark
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(620, now);
      osc1.frequency.exponentialRampToValueAtTime(1020, now + 0.04);
      osc1.frequency.exponentialRampToValueAtTime(460, now + 0.12);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // Tail acoustic chirp
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(780, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1250, now + 0.13);
      osc2.frequency.exponentialRampToValueAtTime(540, now + 0.2);
      gain2.gain.setValueAtTime(0.18, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.23);
    } catch {
      // Audio restricted before gesture
    }
  };

  const handlePuppyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBarking(true);
    setIsFlipping(true);
    playBark();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHearts(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => Date.now() - h.id < 1200));
    }, 1100);

    setTimeout(() => {
      setIsFlipping(false);
      setIsBarking(false);
    }, 1200);
  };

  return (
    <div 
      className={`absolute bottom-1 pointer-events-auto cursor-pointer select-none animate-[pup-patrol-runway_13s_linear_infinite] ${className}`}
      onClick={handlePuppyClick}
      title="🐾 Click to pet the puppy & hear him bark!"
    >
      {/* Floating Hearts on Pet */}
      {hearts.map(h => (
        <span 
          key={h.id}
          className="absolute z-50 pointer-events-none -top-8 left-2 flex items-center gap-1 text-rose-400 font-extrabold text-xs animate-bounce whitespace-nowrap"
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-ping" />
          <span className="text-[10px] text-rose-300 font-bold">Woof! ❤️</span>
        </span>
      ))}

      {/* Bark Speech Bubble */}
      {isBarking && (
        <div className="absolute -top-7 -right-3 z-40 bg-white/95 dark:bg-slate-900/95 border border-amber-300 dark:border-amber-500/50 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full text-[9px] font-black shadow-lg flex items-center gap-1 animate-in zoom-in-95 duration-150 whitespace-nowrap">
          <span>🐾</span>
          <span>Woof!</span>
        </div>
      )}

      {/* ── REALISTIC 3D PUPPY RIG ─────────────────────────────────────────── */}
      <div className={`relative flex flex-col items-center ${isFlipping ? 'animate-[pup-flip_0.65s_ease-in-out]' : 'animate-[mini-pup-trot_0.4s_ease-in-out_infinite]'}`}>
        
        {/* Soft Ground Contact Shadow */}
        <div className="absolute -bottom-1 w-14 h-3 bg-slate-900/35 dark:bg-black/65 rounded-full blur-[2px]" />

        {/* ── 1. REALISTIC PUPPY HEAD & EARS ─────────────────────────────────── */}
        <div className="relative z-20 flex flex-col items-center">
          
          {/* Left Floppy Realistic Ear with Fur Gradient */}
          <div 
            className="absolute -top-1 -left-3.5 w-4 h-7 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-2xl rotate-[28deg] shadow-sm border border-amber-900/30 animate-[mini-pup-ear_0.9s_ease-in-out_infinite]"
            style={{ transformOrigin: 'top right' }}
          >
            <div className="w-2 h-4 bg-amber-500/40 rounded-full mx-auto mt-1" />
          </div>
          
          {/* Right Floppy Realistic Ear */}
          <div 
            className="absolute -top-1 -right-3.5 w-4 h-7 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-800 rounded-2xl rotate-[-28deg] shadow-sm border border-amber-900/30 animate-[mini-pup-ear_0.9s_ease-in-out_infinite_0.2s]"
            style={{ transformOrigin: 'top left' }}
          >
            <div className="w-2 h-4 bg-amber-500/40 rounded-full mx-auto mt-1" />
          </div>

          {/* 3D Realistic Head Structure */}
          <div className="relative w-9 h-8 rounded-[1.1rem] bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border border-amber-300/80 shadow-[0_3px_8px_rgba(0,0,0,0.18),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(180,83,9,0.2)] flex flex-col items-center justify-between p-1">
            
            {/* Forehead Fur Blaze */}
            <div className="w-3 h-2 bg-gradient-to-b from-white/95 to-amber-100/60 rounded-full mx-auto" />

            {/* Realistic Puppy Eyes */}
            <div className="relative z-10 flex items-center justify-between w-6 -mt-0.5 px-0.5">
              {/* Left Eye */}
              <div className="relative w-2 h-2.5 rounded-full bg-gradient-to-b from-amber-950 to-black flex items-center justify-center shadow-xs border border-amber-900/40">
                <span className="w-0.8 h-0.8 rounded-full bg-white absolute top-0.5 right-0.5" />
                <span className="w-0.5 h-0.5 rounded-full bg-white/70 absolute bottom-0.5 left-0.5" />
              </div>
              {/* Right Eye */}
              <div className="relative w-2 h-2.5 rounded-full bg-gradient-to-b from-amber-950 to-black flex items-center justify-center shadow-xs border border-amber-900/40">
                <span className="w-0.8 h-0.8 rounded-full bg-white absolute top-0.5 right-0.5" />
                <span className="w-0.5 h-0.5 rounded-full bg-white/70 absolute bottom-0.5 left-0.5" />
              </div>
            </div>

            {/* Realistic Snout & Leather Nose */}
            <div className="relative w-5 h-3.5 rounded-full bg-gradient-to-b from-white via-amber-50 to-amber-100 border border-amber-200 shadow-xs flex flex-col items-center justify-center -mt-0.5">
              {/* Leathery Black Nose */}
              <div className="w-2 h-1.5 rounded-full bg-slate-950 shadow-xs flex items-center justify-center">
                <span className="w-0.8 h-0.5 rounded-full bg-white/70 -mt-0.5" />
              </div>
              {/* Pink Tongue */}
              <div className="w-1.5 h-1 rounded-b-full bg-rose-400 shadow-xs mt-0.5 animate-pulse" />
            </div>

          </div>

          {/* Cute Cyan LED Collar */}
          <div className="relative w-7 h-2 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-cyan-400 shadow-[0_0_8px_#38bdf8] -mt-1 flex items-center justify-center z-20 border border-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>

        </div>

        {/* ── 2. REALISTIC 3D BODY & FEATHERED TAIL ──────────────────────────── */}
        <div className="relative flex items-center justify-center -mt-1 z-10">
          
          {/* Rounded Puppy Body */}
          <div className="relative w-11 h-6.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border border-amber-300/80 shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.85)] flex items-center justify-center overflow-hidden">
            {/* Soft Cream Chest/Belly Ruff */}
            <div className="w-6 h-5 rounded-full bg-gradient-to-b from-white/95 to-amber-100/80 translate-y-1 shadow-inner" />
          </div>

          {/* Realistic Feathered Wagging Tail */}
          <div 
            className="absolute -right-2 top-0 w-3 h-5 bg-gradient-to-t from-amber-500 via-amber-600 to-amber-700 rounded-full border border-amber-700/40 shadow-xs animate-[mini-pup-tail-wag_0.2s_ease-in-out_infinite]"
            style={{ transformOrigin: 'bottom left' }}
          >
            {/* Fluffy white tail tip */}
            <span className="absolute top-0 right-0 w-1.5 h-2 bg-white rounded-t-full shadow-2xs" />
          </div>

        </div>

        {/* ── 3. 4 REALISTIC TROTTING PAWS ──────────────────────────────────── */}
        <div className="relative w-10 flex items-center justify-between px-0.5 -mt-0.5 z-0">
          {/* Front Left Paw */}
          <div 
            className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 via-amber-300 to-white rounded-full border border-amber-300/60 shadow-2xs animate-[mini-pup-leg-1_0.4s_ease-in-out_infinite]"
            style={{ transformOrigin: 'top center' }}
          />
          {/* Front Right Paw */}
          <div 
            className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 via-amber-300 to-white rounded-full border border-amber-300/60 shadow-2xs animate-[mini-pup-leg-2_0.4s_ease-in-out_infinite]"
            style={{ transformOrigin: 'top center' }}
          />
          {/* Back Left Paw */}
          <div 
            className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 via-amber-300 to-white rounded-full border border-amber-300/60 shadow-2xs animate-[mini-pup-leg-2_0.4s_ease-in-out_infinite]"
            style={{ transformOrigin: 'top center' }}
          />
          {/* Back Right Paw */}
          <div 
            className="w-1.5 h-3.5 bg-gradient-to-b from-amber-400 via-amber-300 to-white rounded-full border border-amber-300/60 shadow-2xs animate-[mini-pup-leg-1_0.4s_ease-in-out_infinite]"
            style={{ transformOrigin: 'top center' }}
          />
        </div>

      </div>
    </div>
  );
};

export default CyberPuppy;
