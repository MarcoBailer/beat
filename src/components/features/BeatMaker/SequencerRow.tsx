import Pad from './Pad';

interface SequencerRowProps {
  instrumentName: string;
  soundId: string;
  numSteps: number;
  rowIndex: number;
  rowState: boolean[];
  onPadClick: (row: number, col: number) => void;
  currentStep: number;
}

export default function SequencerRow({ 
  instrumentName, 
  soundId, 
  numSteps, 
  rowIndex, 
  rowState, 
  onPadClick, 
  currentStep 
}: SequencerRowProps) {
  return (
    <div className="flex gap-1 items-center">
      <div className="shrink-0 w-16 h-8 flex items-center justify-center bg-background-dark/50 rounded-md text-xs text-text-secondary font-medium">
        {instrumentName}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: numSteps }).map((_, colIndex) => (
          <Pad
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            soundId={soundId}
            isActive={rowState[colIndex]}
            isCurrentStep={currentStep === colIndex}
            onClick={() => onPadClick(rowIndex, colIndex)}
          />
        ))}
      </div>
    </div>
  );
}