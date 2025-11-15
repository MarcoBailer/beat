'use client';

import { useStudioStore } from '@/libs/studioStore';
import TrackLane from './TrackLane';
import TimelineRuler from './TimelineRuler';
import React from 'react';

const PIXELS_PER_SECOND = 100;
const LABEL_WIDTH_REM = 12;

export default function ArrangementView() { 
  const tracks = useStudioStore((state) => state.tracks);
  const addTrack = useStudioStore((state) => state.addTrack);

  const isPlaying = useStudioStore((s) => s.isPlaying);
  const play = useStudioStore((s) => s.play);
  const stop = useStudioStore((s) => s.stop);
  const playheadSec = useStudioStore((s) => s.playheadSec);

  const playheadLeft = `calc(${LABEL_WIDTH_REM}rem + ${playheadSec * PIXELS_PER_SECOND}px)`;

  return (
    <div className="grow h-full bg-surface-dark border border-brand-primary/20 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2 border-b border-brand-primary/20 bg-background-dark/50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (isPlaying ? stop() : play())}
            className="px-3 py-1 bg-brand-primary text-background-dark rounded font-bold text-sm"
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
        <div className="text-xs text-text-secondary">
          {playheadSec.toFixed(2)}s
        </div>
      </div>

      <div 
        id="arrangement-scroll-container" 
        className="w-full overflow-x-auto relative"
      >
        <div
          className="pointer-events-none absolute top-8 bottom-0 z-20"
          style={{ left: playheadLeft }}
        >
          <div className="w-px h-full bg-brand-primary/80 shadow-[0_0_6px_rgba(0,255,255,0.6)]" />
        </div>

        <TimelineRuler />

        <div className="flex flex-col">
          {tracks.map((track) => (
            <div key={track.id} className="flex">
              <div className="shrink-0 w-48 p-2 border-r border-b border-brand-primary/10">
                <span className="text-sm text-text-secondary">{track.name}</span>
              </div>
              <TrackLane track={track} />
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={addTrack}
        className="w-full p-2 mt-2 bg-background-dark/50 text-text-secondary hover:text-brand-primary border-t border-brand-primary/20 transition-colors"
      >
        + Adicionar Track
      </button>
    </div>
  );
}