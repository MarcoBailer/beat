'use client';

import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useState } from 'react';
import { useStudioStore } from '@/libs/studioStore';
import SoundLibrary from './SoundLibrary';
import ArrangementView from './ArrangementView';

export default function StudioLayout() {
  const { addClip, moveClip } = useStudioStore((state) => state);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id);
  }

  function handleDragOver(event: DragOverEvent) {
    // Lógica para mostrar onde o clip vai cair (feedback visual)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveDragId(null);
      return;
    }

    const overId = over.id as string;
    const overTrackId = over.data?.current?.trackId;
    const newStartTime = over.data?.current?.startTime;
    
    const activeId = active.id as string;
    const isClip = active.data?.current?.isClip;
    const isSound = active.data?.current?.isSound;
    const soundData = active.data?.current?.sound;

    if (isSound && overTrackId) {
      addClip({
        soundId: soundData.id,
        trackId: overTrackId,
        startTime: newStartTime || 0,
        duration: soundData.duration,
        name: soundData.name,
      });
    } else if (isClip && overTrackId) {
      moveClip(activeId, overTrackId, newStartTime || 0);
    }
    
    setActiveDragId(null);
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="flex flex-col md:flex-row gap-4 w-full h-full">
        <SoundLibrary />
        
        <ArrangementView />
      </div>
    </DndContext>
  );
}