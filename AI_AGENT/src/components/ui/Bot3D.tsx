import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bot, Zap, RefreshCw } from 'lucide-react';

interface Bot3DProps {
  size?: 'hero' | 'lg' | 'md' | 'sm';
  greetingText?: string;
  showSpeechBubble?: boolean;
  onAskClick?: (prompt?: string) => void;
  className?: string;
  autoWave?: boolean;
}

export const Bot3D: React.FC<Bot3DProps> = ({
  size = 'hero',
  greetingText = "Hi! 👋 I'm Cira",
  showSpeechBubble = true,
  onAskClick,
  className = '',
  autoWave = true,
}) => {
  const [isWaving, setIsWaving] = useState(autoWave);
  const [isBlinking, setIsBlinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [clickSparks, setClickSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sci-fi friendly melodic chime
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(523.25, now, 0.15);        // C5
      playTone(659.25, now + 0.08, 0.18); // E5
      playTone(783.99, now + 0.16, 0.25); // G5
      playTone(1046.50, now + 0.24, 0.4); // C6
    } catch {
      // Audio context restricted before user interaction
    }
  };

  // Speak greeting using Web Speech API
  const speakGreeting = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Hi! I'm Cira, your institutional AI assistant. Welcome!");
      utterance.rate = 1.05;
      utterance.pitch = 1.15;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira')));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Wave trigger
  const triggerWave = (withSpeech = false) => {
    setIsWaving(true);
    if (soundEnabled || withSpeech) {
      playChime();
      speakGreeting();
    }
  };

  // Blinking interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Auto wave continuously when component mounts
  useEffect(() => {
    if (autoWave) {
      setIsWaving(true);
    }
  }, [autoWave]);

  // 3D Parallax Mouse Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rx = -(y / (rect.height / 2)) * 12;
    const ry = (x / (rect.width / 2)) * 15;
    
    setTilt({
      x: (x / (rect.width / 2)) * 8,
      y: (y / (rect.height / 2)) * 8,
      rx,
      ry,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, rx: 0, ry: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickSparks(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
      setClickSparks(prev => prev.filter(s => Date.now() - s.id < 1000));
    }, 900);

    triggerWave(soundEnabled);
  };

  // Sizing definitions
  const sizeConfig = {
    hero: {
      wrapper: 'w-full max-w-[420px]',
      canvasHeight: 'h-[360px] sm:h-[390px]',
      robotScale: 'scale-[1.12] sm:scale-[1.22]',
      greetingPos: 'top-2 right-2 sm:right-6',
    },
    lg: {
      wrapper: 'w-full max-w-[360px]',
      canvasHeight: 'h-[320px] sm:h-[340px]',
      robotScale: 'scale-[1.02] sm:scale-[1.12]',
      greetingPos: 'top-2 right-2',
    },
    md: {
      wrapper: 'w-full max-w-[290px]',
      canvasHeight: 'h-[270px]',
      robotScale: 'scale-[0.88]',
      greetingPos: 'top-1 right-1',
    },
    sm: {
      wrapper: 'w-[140px]',
      canvasHeight: 'h-[140px]',
      robotScale: 'scale-[0.55]',
      greetingPos: 'hidden',
    },
  }[size];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative select-none flex flex-col items-center justify-center cursor-pointer group ${sizeConfig.wrapper} ${className}`}
      style={{ perspective: '1200px' }}
      title="Click me to wave & say hi!"
    >
      {/* Click Sparkles */}
      {clickSparks.map(spark => (
        <span
          key={spark.id}
          className="absolute z-40 pointer-events-none animate-ping text-sky-400 font-bold text-sm flex items-center gap-1"
          style={{ left: spark.x, top: spark.y }}
        >
          ✨ 👋
        </span>
      ))}

      {/* ── 3D ROBOT VIEWPORT ────────────────────────────────────────────────── */}
      <div className={`relative w-full ${sizeConfig.canvasHeight} flex items-center justify-center overflow-visible`}>
        
        {/* Holographic floor ring & shadow */}
        <div className="absolute bottom-4 w-52 sm:w-64 h-16 flex items-center justify-center pointer-events-none">
          {/* Dynamic soft shadow */}
          <div 
            className="absolute w-44 h-8 bg-indigo-950/40 dark:bg-black/80 rounded-full blur-md transition-all duration-300"
            style={{
              transform: `scale(${isHovered ? 1.15 : 1}) translateY(${tilt.rx * 0.3}px)`,
              opacity: isHovered ? 0.8 : 0.55,
            }}
          />
          {/* Cyan holographic grid rings */}
          <div className="absolute w-48 sm:w-60 h-12 rounded-[50%] border-2 border-dashed border-sky-400/40 dark:border-sky-400/30 animate-[spin_18s_linear_infinite]" />
          <div className="absolute w-36 sm:w-44 h-8 rounded-[50%] border border-indigo-400/50 dark:border-indigo-500/40 animate-[spin_10s_linear_infinite_reverse]" />
          <div className="absolute w-24 h-5 rounded-[50%] bg-gradient-to-r from-sky-400/20 via-indigo-500/30 to-emerald-400/20 blur-sm animate-pulse" />
        </div>

        {/* Ambient floating spark particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-sky-400/80 blur-[0.5px] animate-[float-up_4s_ease-in-out_infinite]" />
          <span className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-indigo-400/70 blur-[0.5px] animate-[float-up_5s_ease-in-out_infinite_1s]" />
          <span className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400/80 blur-[0.5px] animate-[float-up_4.5s_ease-in-out_infinite_2s]" />
        </div>

        {/* ── ROBOT 3D RIG ROOT ──────────────────────────────────────────────── */}
        <div
          className={`relative transition-transform duration-150 ease-out ${sizeConfig.robotScale}`}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(20px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Levitating / Bobbing Animation Container */}
          <div className="relative animate-[bot-hover_3.6s_ease-in-out_infinite] flex flex-col items-center">

            {/* ── 1. ANTENNA & ENERGY BEACON ────────────────────────── */}
            <div className="relative flex flex-col items-center -mb-1 z-20">
              {/* Pulsing Energy Orb */}
              <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-sky-300 via-cyan-400 to-indigo-500 shadow-[0_0_15px_#38bdf8] flex items-center justify-center animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping opacity-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              {/* Radiating beacon rings */}
              <div className="absolute -top-1 w-7 h-7 rounded-full border border-sky-400/60 animate-ping" />
              {/* Antenna Mast */}
              <div className="w-1.5 h-5 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 rounded-t-sm shadow-inner" />
            </div>

            {/* ── 2. ROBOT HEAD ──────────────────────────────────────── */}
            <div
              className="relative w-36 h-28 sm:w-40 sm:h-32 rounded-[2.2rem] bg-gradient-to-b from-white via-slate-100 to-slate-200 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 border-2 border-white/80 dark:border-slate-300 shadow-[0_12px_28px_rgba(0,0,0,0.22),inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-4px_8px_rgba(0,0,0,0.12)] flex items-center justify-center p-2.5 z-10 transition-transform duration-200"
              style={{
                transform: `rotateX(${-tilt.rx * 0.4}deg) rotateY(${tilt.ry * 0.4}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glossy Top Bevel Highlight */}
              <div className="absolute top-1.5 left-6 right-6 h-3 bg-gradient-to-b from-white/90 to-transparent rounded-full pointer-events-none" />

              {/* Side Audio Earpieces / Headphones */}
              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-4 h-10 rounded-l-xl bg-gradient-to-r from-slate-400 via-indigo-600 to-indigo-700 border-l border-indigo-400 shadow-md flex items-center justify-center">
                <span className="w-1.5 h-5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              </div>
              <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-4 h-10 rounded-r-xl bg-gradient-to-l from-slate-400 via-indigo-600 to-indigo-700 border-r border-indigo-400 shadow-md flex items-center justify-center">
                <span className="w-1.5 h-5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              </div>

              {/* ── DARK GLASS VISOR ─────────────────────────────────── */}
              <div className="relative w-full h-full rounded-[1.6rem] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9),0_0_12px_rgba(56,189,248,0.2)] flex flex-col items-center justify-center overflow-hidden p-2">
                
                {/* Visor Glass Gloss Reflex */}
                <div className="absolute -top-6 -left-6 w-32 h-16 bg-gradient-to-br from-white/20 via-white/5 to-transparent rotate-[-25deg] rounded-full pointer-events-none" />

                {/* Visor Matrix Grid Overlay */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
                    backgroundSize: '8px 8px',
                  }}
                />

                {/* ── LED DIGITAL EYES / FACE ─────────────────────────── */}
                <div className="relative z-10 flex items-center justify-center gap-5 sm:gap-6 mt-1">
                  
                  {/* LEFT EYE (Smiling Happy Arc ^) */}
                  <div
                    className="relative transition-all duration-150"
                    style={{
                      transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`,
                    }}
                  >
                    {isBlinking ? (
                      <div className="w-6 h-1 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
                    ) : (
                      /* Happy curved arc eye ^ */
                      <div className="w-6 h-5 border-t-[3.5px] border-l-[3.5px] border-r-[3.5px] border-b-0 border-sky-400 rounded-t-full shadow-[0_0_12px_#38bdf8]" />
                    )}
                  </div>

                  {/* RIGHT EYE (Smiling Happy Arc ^) */}
                  <div
                    className="relative transition-all duration-150"
                    style={{
                      transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`,
                    }}
                  >
                    {isBlinking ? (
                      <div className="w-6 h-1 bg-sky-400 rounded-full shadow-[0_0_10px_#38bdf8]" />
                    ) : (
                      /* Happy curved arc eye ^ */
                      <div className="w-6 h-5 border-t-[3.5px] border-l-[3.5px] border-r-[3.5px] border-b-0 border-sky-400 rounded-t-full shadow-[0_0_12px_#38bdf8]" />
                    )}
                  </div>

                </div>

                {/* Cute Smiling LED Mouth */}
                <div className="mt-2 flex items-center justify-center">
                  <div className="w-3.5 h-1.5 border-b-2 border-sky-400/90 rounded-b-full shadow-[0_0_6px_#38bdf8]" />
                </div>

                {/* Visor bottom status ticker */}
                <div className="mt-1 flex items-center gap-1 opacity-75">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[7px] font-mono text-cyan-300 tracking-wider">ONLINE</span>
                </div>

              </div>
            </div>

            {/* ── 3. NECK CONNECTOR ──────────────────────────────────── */}
            <div className="w-10 h-3 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-md -my-0.5 z-0 shadow-inner" />

            {/* ── 4. ROBOT TORSO & ARMS ──────────────────────────────── */}
            <div className="relative flex items-center justify-center">

              {/* ── LEFT ARM (Resting / Swaying) ────────────────────── */}
              <div 
                className="relative -mr-2 z-0 animate-[left-arm-sway_4s_ease-in-out_infinite]"
                style={{ transformOrigin: 'top center' }}
              >
                {/* Shoulder joint */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-300 dark:to-slate-500 border border-white/60 shadow-md" />
                {/* Upper arm */}
                <div className="w-3.5 h-8 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full mx-auto -mt-1 shadow-inner" />
                {/* Forearm & Hand */}
                <div className="w-4 h-7 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-2xl mx-auto -mt-1 shadow-md flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/70" />
                </div>
              </div>

              {/* ── MAIN CHEST / TORSO ───────────────────────────────── */}
              <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-[2rem] bg-gradient-to-b from-white via-slate-100 to-slate-200 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 border-2 border-white/80 dark:border-slate-300 shadow-[0_10px_24px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.9)] flex flex-col items-center justify-between p-3 z-10">
                
                {/* Top Chest Monogram */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/10 dark:bg-slate-900/20 text-[8px] font-mono font-black tracking-widest text-slate-700">
                  <Bot className="w-2.5 h-2.5 text-indigo-600" />
                  <span>CIRA</span>
                </div>

                {/* ── ARC REACTOR CORE ──────────────────────────────── */}
                <div className="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-indigo-500/80 shadow-[0_0_18px_rgba(99,102,241,0.6),inset_0_0_8px_#38bdf8] flex items-center justify-center">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/60 animate-[spin_6s_linear_infinite]" />
                  {/* Inner pulsing core */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 via-cyan-300 to-indigo-500 shadow-[0_0_12px_#38bdf8] flex items-center justify-center animate-pulse">
                    <Zap className="w-3 h-3 text-white fill-white animate-[spin_8s_linear_infinite]" />
                  </div>
                </div>

                {/* Institutional Badge / Status dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

              {/* ── RIGHT ARM (AUTOMATICALLY RAISED HIGH & WAVING!) ──── */}
              <div className="relative -ml-2 z-20">
                {/* Fixed Shoulder Socket */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-300 dark:to-slate-500 border border-white/70 shadow-md flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500/80" />
                </div>

                {/* Articulated Raised Upper Arm (Points UP & OUT toward top-right) */}
                <div 
                  className={`absolute top-2 left-2 origin-top-left ${
                    isWaving ? 'animate-[bot-arm-raised-wave_1.6s_ease-in-out_infinite]' : 'animate-[right-arm-idle_4s_ease-in-out_infinite]'
                  }`}
                  style={{
                    transformOrigin: '0% 0%',
                  }}
                >
                  {/* Upper Arm Bone */}
                  <div className="w-4 h-9 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-400 rounded-full shadow-inner border border-white/40" />
                  
                  {/* Elbow Joint */}
                  <div className="w-5 h-5 -mt-2 -ml-0.5 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 border border-white/50 shadow-sm flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
                  </div>

                  {/* Forearm & 3D Waving Hand */}
                  <div 
                    className="relative -mt-1 origin-top flex flex-col items-center animate-[bot-forearm-wave_1.1s_ease-in-out_infinite]"
                    style={{ transformOrigin: 'top center' }}
                  >
                    {/* Forearm segment */}
                    <div className="w-4 h-7 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-2xl shadow-md border border-white/50" />

                    {/* Open Waving Palm */}
                    <div className="relative w-6 h-7 -mt-1 bg-gradient-to-b from-white via-slate-100 to-slate-300 rounded-xl shadow-lg border border-white/70 flex flex-col items-center justify-center">
                      
                      {/* Glowing Cyan Palm Sensor */}
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 shadow-[0_0_8px_#38bdf8] flex items-center justify-center">
                        <span className="w-1 h-1 rounded-full bg-white" />
                      </div>

                      {/* Articulated Open Fingers Waving */}
                      <div className="absolute -top-3 flex gap-0.5">
                        <span className="w-1 h-3.5 bg-slate-200 dark:bg-slate-300 rounded-t-full border-t border-white shadow-xs" />
                        <span className="w-1 h-4.5 bg-slate-200 dark:bg-slate-300 rounded-t-full border-t border-white shadow-xs" />
                        <span className="w-1 h-4 bg-slate-200 dark:bg-slate-300 rounded-t-full border-t border-white shadow-xs" />
                        <span className="w-1 h-3 bg-slate-200 dark:bg-slate-300 rounded-t-full border-t border-white shadow-xs" />
                      </div>

                      {/* Thumb */}
                      <span className="absolute -left-1 top-2 w-1.5 h-2.5 bg-slate-200 dark:bg-slate-300 rounded-l-full border-l border-white shadow-xs -rotate-45" />

                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── FLOATING GREETING PILL ("Saying Hi!" - Clean, NO dark box!) ──── */}
        {showSpeechBubble && size !== 'sm' && (
          <div 
            className={`absolute z-30 ${sizeConfig.greetingPos} flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-200 dark:border-indigo-500/40 shadow-lg shadow-indigo-500/15 animate-[bot-greeting-pop_2.5s_ease-in-out_infinite]`}
            onClick={(e) => {
              e.stopPropagation();
              triggerWave(true);
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap">
              {greetingText}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) {
                  playChime();
                  speakGreeting();
                }
              }}
              className={`p-1 rounded-md text-xs transition-colors ${
                soundEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Voice enabled' : 'Click to hear greeting'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

      </div>

      {/* ── BOT STATUS BADGE ────────────────────────────────────────────────── */}
      <div className="relative mt-2 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-500/30 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover:border-indigo-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-wider text-indigo-600 dark:text-indigo-400 uppercase font-extrabold">
          CIRA AI AGENT ONLINE
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerWave(true);
          }}
          className="ml-1 px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
          title="Click to wave & speak"
        >
          <RefreshCw className="w-2.5 h-2.5 hover:rotate-180 transition-transform" /> Wave
        </button>
      </div>

    </div>
  );
};

export default Bot3D;
