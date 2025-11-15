import BeatMaker from "@/components/features/BeatMaker/BeatMaker";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SequencerPage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-12">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-primary text-shadow-neon mb-8">
        Sequenciador de Batidas
      </h1>
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
        </div>
      }>
        <BeatMaker />
      </Suspense>
    </main>
  );
}