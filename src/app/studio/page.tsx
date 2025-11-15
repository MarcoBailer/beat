import StudioLayout from "@/components/features/Studio/StudioLayout";

export default function StudioPage() {
  return (
    <main className="flex flex-col w-full min-h-screen p-4 bg-background-dark">
      <h1 className="text-3xl font-bold text-brand-primary text-shadow-neon mb-6">
        Estúdio de Produção
      </h1>
      
      <StudioLayout />
    </main>
  );
}