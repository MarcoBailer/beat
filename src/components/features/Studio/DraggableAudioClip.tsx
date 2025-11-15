'use client';

import { useDraggable } from '@dnd-kit/core';
import { TimelineClip } from '@/libs/studioStore';

const PIXELS_PER_SECOND = 100;

export default function DraggableAudioClip({ clip }: { clip: TimelineClip }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: clip.id,
    data: {
      isClip: true,
      clip: clip,
    },
  });

  const style = {
    left: `${clip.startTime * PIXELS_PER_SECOND}px`,
    width: `${clip.duration * PIXELS_PER_SECOND}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute top-1 h-14 bg-brand-primary/80 border-2 border-brand-primary rounded-md cursor-grab active:cursor-grabbing active:shadow-neon-medium overflow-hidden touch-none"
    >
      <span className="p-1 text-xs text-background-dark font-bold truncate">
        {clip.name}
      </span>
    </div>
  );
}

export function DraggableAudioClipPreview({ clip }: { clip: TimelineClip }) {
  const style = {
    width: `${clip.duration * PIXELS_PER_SECOND}px`,
  };

  return (
    <div
      style={style}
      className="h-14 bg-brand-primary/80 border-2 border-brand-primary rounded-md cursor-grabbing shadow-neon-medium overflow-hidden opacity-75"
    >
      <span className="p-1 text-xs text-background-dark font-bold truncate">
        {clip.name}
      </span>
    </div>
  );
}