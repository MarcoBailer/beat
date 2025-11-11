'use client';

interface PadProps {
  row: number;
  col: number;
  soundId: string;
  isActive: boolean;
  isCurrentStep: boolean;
  onClick: () => void;
}

export default function Pad({ 
  row, 
  col, 
  soundId, 
  isActive, 
  isCurrentStep, 
  onClick 
}: PadProps) {
  
  const isBeatMarker = (col % 4) === 0;

  return (
    <div
      onClick={onClick}
      className={`
        w-8 h-8 rounded-md cursor-pointer transition-all duration-75
        shrink-0
        ${isCurrentStep ? 'border-2 border-white shadow-neon-soft' : ''}
        ${
          isActive 
            ? 'bg-brand-primary shadow-neon-medium scale-105' 
            : `hover:bg-surface-dark/80 ${isBeatMarker ? 'bg-background-dark/80' : 'bg-background-dark/30'}`
        }
      `}
      data-row={row}
      data-col={col}
      data-sound={soundId}
    />
  );
}