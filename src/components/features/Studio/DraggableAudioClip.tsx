'use client';

import { useDraggable } from '@dnd-kit/core';
import { TimelineClip, useStudioStore } from '@/libs/studioStore';
import { useEffect, useMemo, useRef } from 'react';

const PIXELS_PER_SECOND = 100;
const CLIP_HEIGHT = 56;

export default function DraggableAudioClip({ clip }: { clip: TimelineClip }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: clip.id,
    data: {
      isClip: true,
      clip: clip,
    },
  });

  const peaks = useStudioStore((s) => s.waveforms.get(clip.soundId));
  const buffer = useStudioStore((s) => s.buffers.get(clip.soundId));

  const widthPx = useMemo(() => Math.max(1, Math.round(clip.duration * PIXELS_PER_SECOND)), [clip.duration]);

  const style = {
    left: `${clip.startTime * PIXELS_PER_SECOND}px`,
    width: `${widthPx}px`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks || !buffer) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.width = `${widthPx}px`;
    canvas.style.height = `${CLIP_HEIGHT}px`;
    canvas.width = Math.max(1, Math.floor(widthPx * dpr));
    canvas.height = Math.floor(CLIP_HEIGHT * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = widthPx;
    const h = CLIP_HEIGHT;
    const mid = h / 2;
    const color = 'rgba(0, 218, 134, 0.9)';

    ctx.lineWidth = 1;
    ctx.strokeStyle = color;

    const bufferDur = buffer.duration || clip.duration || 1;

    for (let x = 0; x < w; x++) {
      const t = (x / w) * clip.duration;
      const frac = Math.min(1, Math.max(0, t / bufferDur));
      const idx = Math.min(peaks.length - 1, Math.floor(frac * peaks.length));
      const amp = peaks[idx];
      const y = amp * (h / 2 - 2);
      ctx.beginPath();
      ctx.moveTo(x + 0.5, mid - y);
      ctx.lineTo(x + 0.5, mid + y);
      ctx.stroke();
    }

    ctx.restore();
  }, [peaks, buffer, widthPx]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute top-1 h-14 bg-brand-primary/10 border-2 border-brand-primary rounded-md cursor-grab active:cursor-grabbing active:shadow-neon-medium overflow-hidden touch-none"
    >
      <canvas ref={canvasRef} className="pointer-events-none block" />

      <span className="absolute left-1 top-1 p-1 text-xs text-brand-primary font-bold truncate bg-black/20 rounded">
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
      className="h-14 bg-brand-primary/20 border-2 border-brand-primary rounded-md cursor-grabbing shadow-neon-medium overflow-hidden opacity-75"
    >
      <span className="p-1 text-xs text-background-dark font-bold truncate">
        {clip.name}
      </span>
    </div>
  );
}