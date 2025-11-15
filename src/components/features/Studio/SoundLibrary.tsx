'use client';

import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useStudioStore, LibrarySound } from '@/libs/studioStore';
import { Music3 } from 'lucide-react';
import React from 'react';

// Componente para um item "arrastável" na biblioteca
function DraggableSound({ sound }: { sound: LibrarySound }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `sound-${sound.id}`,
    data: {
      isSound: true, // Para identificar no dragEnd
      sound: sound,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 bg-background-dark/50 border border-brand-primary/30 rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing active:shadow-neon-medium"
    >
      <Music3 className="w-4 h-4 text-brand-primary" />
      <span className="text-xs text-text-primary truncate">{sound.name}</span>
    </div>
  );
}

// Componente principal da biblioteca
export default function SoundLibrary() {
  const { sounds, addSound } = useStudioStore();

  const handleImportSound = () => {
    // Lógica de importação (ex: abrir <input type="file">)
    // Por enquanto, adiciona um som de exemplo:
    addSound({
      name: `New Sound ${sounds.length + 1}.wav`,
      url: '/sounds/new.wav',
      duration: 2,
    });
  };

  return (
    <div className="w-full md:w-64 h-full p-4 bg-surface-dark border border-brand-primary/20 rounded-lg shrink-0">
      <h2 className="text-lg font-bold text-brand-primary mb-4">Biblioteca de Sons</h2>
      
      <button
        onClick={handleImportSound}
        className="w-full p-2 mb-4 bg-brand-primary text-background-dark font-bold text-sm rounded hover:shadow-neon-soft transition-all"
      >
        Importar Som
      </button>

      <div className="flex flex-col gap-2 h-96 overflow-y-auto">
        {sounds.map(sound => (
          <DraggableSound key={sound.id} sound={sound} />
        ))}
      </div>
    </div>
  );
}