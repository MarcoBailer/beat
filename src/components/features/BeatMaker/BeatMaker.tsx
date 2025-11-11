'use client';

import { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import { toast } from 'sonner';
import Sequencer from './Sequencer';
import { initializeAudio, loadSounds, playSound, soundMap } from '@/libs/sounds';
import { useInterval } from '@/hooks/useInteval';

const ROWS = 6;
const STEPS = 32;

const instrumentMapping: Record<number, string> = {
  0: 'si',
  1: 'hithat',
  2: 'crash',
  3: 'snare',
  4: 'tape',
  5: 'clap',
};

function createEmptyGrid(): boolean[][] {
  return Array(ROWS).fill(null).map(() => Array(STEPS).fill(false));
}

export default function BeatMaker() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(100);
  const [currentStep, setCurrentStep] = useState(0);
  const [grid, setGrid] = useState(createEmptyGrid());
  const [trilhaAtiva, setTrilhaAtiva] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const soundBuffersRef = useRef<Map<string, AudioBuffer> | null>(null);
  const trilhaNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleInitialize = async () => {
    if (isInitialized) return;
    const ctx = initializeAudio();
    audioContextRef.current = ctx;
    soundBuffersRef.current = await loadSounds(ctx);
    setIsInitialized(true);
    toast.success("Motor de áudio carregado!");
  };

  const intervalDelay = isPlaying ? (60000 / bpm) / 4 : null;

  useInterval(() => {
    const nextStep = (currentStep + 1) % STEPS;
    setCurrentStep(nextStep);

    const ctx = audioContextRef.current;
    const buffers = soundBuffersRef.current;
    if (!ctx || !buffers) return;

    for (let row = 0; row < ROWS; row++) {
      if (grid[row][nextStep]) {
        const soundId = instrumentMapping[row];
        const buffer = buffers.get(soundId);
        if (buffer) {
          playSound(ctx, buffer);
        }
      }
    }
  }, intervalDelay);

  useEffect(() => {
    const ctx = audioContextRef.current;
    const buffers = soundBuffersRef.current;
    if (!ctx || !buffers || !isInitialized) return;

    if (trilhaAtiva) {
      const buffer = buffers.get('trilha');
      if (buffer) {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.loop = true;
        source.start(0);
        trilhaNodeRef.current = source;
      }
    } else {
      trilhaNodeRef.current?.stop();
      trilhaNodeRef.current?.disconnect();
      trilhaNodeRef.current = null;
    }

    return () => {
      trilhaNodeRef.current?.stop();
      trilhaNodeRef.current?.disconnect();
    };
  }, [trilhaAtiva, isInitialized]);

  const handlePlayClick = async () => {
    if (!isInitialized) await handleInitialize();
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentStep(-1);
    }
  };

  const handleTrilhaClick = async () => {
    if (!isInitialized) await handleInitialize();
    setTrilhaAtiva(!trilhaAtiva);
  };

  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
  };

  const handlePadClick = (row: number, col: number) => {
    if (!isInitialized) handleInitialize();
    
    const newGrid = grid.map(r => [...r]); 
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-surface-dark border-2 border-dashed border-brand-primary/50 rounded-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Bem-vindo ao Beat Maker</h2>
        <p className="text-text-secondary mb-6">Clique no botão abaixo para carregar os sons e iniciar.</p>
        <button 
          onClick={handleInitialize}
          className="bg-brand-primary text-background-dark font-bold px-6 py-3 rounded shadow-neon-soft hover:shadow-neon-medium transition-all"
        >
          Carregar Motor de Áudio
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      
      <Controls 
        isPlaying={isPlaying}
        onPlayClick={handlePlayClick}
        bpm={bpm}
        onBpmChange={handleBpmChange}
        trilhaAtiva={trilhaAtiva}
        onTrilhaClick={handleTrilhaClick}
      />
      
      <Sequencer 
        grid={grid}
        onPadClick={handlePadClick}
        currentStep={currentStep}
      />
      
    </div>
  );
}