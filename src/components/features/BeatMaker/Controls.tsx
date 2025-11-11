'use client';

import { Play, Pause } from 'lucide-react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayClick: () => void;
  bpm: number;
  onBpmChange: (newBpm: number) => void;
  trilhaAtiva: boolean;
  onTrilhaClick: () => void;
}

export default function Controls({ 
  isPlaying, 
  onPlayClick, 
  bpm, 
  onBpmChange, 
  trilhaAtiva, 
  onTrilhaClick 
}: ControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-surface-dark border border-brand-primary/20 rounded-lg">
      <button 
        onClick={onPlayClick} 
        className="w-full md:w-auto bg-brand-primary text-background-dark font-bold px-4 py-2 rounded shadow-neon-soft hover:shadow-neon-medium transition-all flex items-center justify-center gap-2"
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        {isPlaying ? 'Pausar' : 'Play'}
      </button>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <input 
          type="range" 
          min="60" 
          max="180" 
          value={bpm} 
          onChange={(e) => onBpmChange(Number(e.target.value))}
          className="w-full md:w-48 accent-brand-primary"
        />
        <span className="text-text-secondary font-mono w-16">{bpm} BPM</span>
      </div>

      <button
        onClick={onTrilhaClick}
        className={`w-full md:w-auto px-4 py-2 rounded font-medium transition-all
          ${trilhaAtiva 
            ? 'bg-brand-secondary text-white shadow-neon-soft' 
            : 'bg-background-dark/50 text-text-secondary hover:bg-surface-dark'
          }`}
      >
        Trilha ({trilhaAtiva ? 'ON' : 'OFF'})
      </button>
    </div>
  );
}