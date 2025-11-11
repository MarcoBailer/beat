import SequencerRow from './SequencerRow';

const instruments = [
  { name: 'Si', sound: 'si' },
  { name: 'Hithat', sound: 'hithat' },
  { name: 'Crash', sound: 'crash' },
  { name: 'Snare', sound: 'snare' },
  { name: 'Tape', sound: 'tape' },
  { name: 'Clap', sound: 'clap' },
];

const NUMBER_OF_STEPS = 32;

interface SequencerProps {
  grid: boolean[][];
  onPadClick: (row: number, col: number) => void;
  currentStep: number;
}

export default function Sequencer({ grid, onPadClick, currentStep }: SequencerProps) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-surface-dark border border-brand-primary/20 rounded-lg overflow-x-auto">
      {instruments.map((inst, rowIndex) => (
        <SequencerRow
          key={inst.sound}
          instrumentName={inst.name}
          soundId={inst.sound}
          numSteps={NUMBER_OF_STEPS}
          rowIndex={rowIndex}
          rowState={grid[rowIndex]}
          onPadClick={onPadClick}
          currentStep={currentStep}
        />
      ))}
    </div>
  );
}