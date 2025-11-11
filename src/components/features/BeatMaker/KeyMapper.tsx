'use client';

export default function KeyMapper() {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-surface-dark border border-brand-primary/20 rounded-lg">
      <input type="text" placeholder="Tecla 1" className="input-style" />
      <input type="text" placeholder="Tecla 2" className="input-style" />
      <input type="text" placeholder="Tecla 3" className="input-style" />
      <input type="text" placeholder="Tecla 4" className="input-style" />
      <input type="text" placeholder="Tecla 5" className="input-style" />
      <button className="btn-primary ml-auto">Salvar Teclas</button>

      <style jsx>{`
        .input-style {
          background-color: var(--dark-bg);
          border: 1px solid var(--neon-green);
          color: var(--text-primary);
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          outline: none;
        }
        .btn-primary {
          background-color: var(--brand-primary);
          color: var(--dark-bg);
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          box-shadow: var(--shadow-neon-medium);
        }
      `}</style>
    </div>
  );
}