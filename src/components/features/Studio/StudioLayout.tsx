'use client';

import { 
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragMoveEvent,
  UniqueIdentifier,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { useStudioStore, LibrarySound, TimelineClip } from '@/libs/studioStore';
import SoundLibrary, { SoundLibrarySoundPreview } from './SoundLibrary'; 
import ArrangementView from './ArrangementView';
import { DraggableAudioClipPreview } from './DraggableAudioClip'; 

export default function StudioLayout() {
  const { addClip, moveClip } = useStudioStore((state) => state);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [activeDragData, setActiveDragData] = useState<any>(null);
  const [calculatedStartTime, setCalculatedStartTime] = useState<number>(0);
  const [initialClipStartTime, setInitialClipStartTime] = useState<number>(0);
  const [draggedOverTrackId, setDraggedOverTrackId] = useState<string | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const PIXELS_PER_SECOND = 100;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id);
    setActiveDragData(event.active.data.current);

    const data = event.active.data.current;
    if (data?.isClip) {
      setInitialClipStartTime(data.clip.startTime);
      setDraggedOverTrackId(data.clip.trackId);
      setAutoScrollEnabled(true);
    } else if (data?.isSound) {
      setDraggedOverTrackId(null);
      setAutoScrollEnabled(false);
    }
  }

  function updateDragPosition(event: { over: any; delta: { x: number }; active: any }) {
    const scrollContainer = document.getElementById('arrangement-scroll-container');
    if (!scrollContainer) return;
    const scrollLeft = scrollContainer.scrollLeft;

    let trackId = draggedOverTrackId ?? undefined;
    if (event.over?.data?.current?.trackId) {
      const newId = event.over.data.current.trackId as string;
      if (newId !== draggedOverTrackId) setDraggedOverTrackId(newId);
      trackId = newId;
    }

    let newStartTime = 0;

    if (activeDragData?.isClip) {
      const deltaInSeconds = (event.delta?.x || 0) / PIXELS_PER_SECOND;
      newStartTime = initialClipStartTime + deltaInSeconds;
    } else if (activeDragData?.isSound && trackId) {
      const trackElement = document.querySelector(`[data-track-id="${trackId}"]`) as HTMLElement | null;
      if (!trackElement) return;

      const trackRect = trackElement.getBoundingClientRect();

      const initialLeft = event.active.rect.current.initial?.left ?? 0;
      const currentLeft = initialLeft + (event.delta?.x || 0);

      const xOnTrack = (currentLeft - trackRect.left) + scrollLeft;
      newStartTime = xOnTrack / PIXELS_PER_SECOND;
    } else {
      return;
    }

    newStartTime = Math.round(newStartTime * 4) / 4;
    setCalculatedStartTime(Math.max(0, newStartTime));
  }
  
  function handleDragMove(event: DragMoveEvent) {
    updateDragPosition(event);
  }

  function handleDragOver(event: DragOverEvent) {
    updateDragPosition(event);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;

    if (!over) {
      setActiveDragId(null);
      setActiveDragData(null);
      setInitialClipStartTime(0);
      setDraggedOverTrackId(null);
      return;
    }

    const overTrackId = draggedOverTrackId || over.data?.current?.trackId;
    const { isClip, isSound, sound, clip } = activeDragData || {};
    const newStartTime = calculatedStartTime;

    if (isSound && overTrackId) {
      addClip({
        soundId: sound.id,
        trackId: overTrackId,
        startTime: newStartTime,
        duration: sound.duration,
        name: sound.name,
      });
    } else if (isClip && overTrackId) {
      moveClip(clip.id, overTrackId, newStartTime);
    }

    setActiveDragId(null);
    setActiveDragData(null);
    setInitialClipStartTime(0);
    setDraggedOverTrackId(null);
    setAutoScrollEnabled(true);
  }

  return (
    <DndContext
      autoScroll={autoScrollEnabled}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-4 w-full h-full">
        <SoundLibrary />
        <ArrangementView />
      </div>

      <DragOverlay>
        {activeDragId && activeDragData ? (
          <>
            {activeDragData.isSound && (
              <SoundLibrarySoundPreview sound={activeDragData.sound} />
            )}
            {activeDragData.isClip && (
              <DraggableAudioClipPreview clip={activeDragData.clip} />
            )}
          </>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}