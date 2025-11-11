import BeatMaker from "@/components/features/BeatMaker/BeatMaker";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-12">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-primary text-shadow-neon mb-8">
        Beat Maker Pro
      </h1>
      <BeatMaker />
    </main>
  );
}