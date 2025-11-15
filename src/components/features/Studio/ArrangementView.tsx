'use client';

import { useStudioStore, Track } from '@/libs/studioStore';
import TrackLane from './TrackLane';
import TimelineRuler from './TimelineRuler';

export default function ArrangementView() { 
  const tracks = useStudioStore((state) => state.tracks);
  const addTrack = useStudioStore((state) => state.addTrack);

  return (
    <div className="grow h-full bg-surface-dark border border-brand-primary/20 rounded-lg overflow-hidden">
      <div 
        id="arrangement-scroll-container" 
        className="w-full overflow-x-auto"
      >
        
        <TimelineRuler />

        <div className="flex flex-col">
          {tracks.map((track, index) => (
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