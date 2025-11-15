'use client';

import { useDroppable } from '@dnd-kit/core';
import { useStudioStore, Track, TimelineClip } from '@/libs/studioStore';
import DraggableAudioClip from './DraggableAudioClip';
import { useMemo } from 'react';

const PIXELS_PER_SECOND = 100;
const TOTAL_SECONDS = 60;

export default function TrackLane({ track }: { track: Track }) {
  const allClips = useStudioStore((state) => state.clips);

  const clips = useMemo(() => {
    return allClips.filter(c => c.trackId === track.id);
  }, [allClips, track.id]);

  const { setNodeRef } = useDroppable({
    id: `track-${track.id}`,
    data: {
      trackId: track.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="relative grow h-16 border-b border-brand-primary/10 bg-background-dark/30"
      style={{ width: `${TOTAL_SECONDS * PIXELS_PER_SECOND}px` }}
    >
      {clips.map(clip => (
        <DraggableAudioClip key={clip.id} clip={clip} />
      ))}
    </div>
  );
}