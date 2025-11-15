'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion'; 
import { Grid3x3, Layers } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 10 }
  },
  hover: { 
    scale: 1.03,
    boxShadow: '0 0 40px var(--shadow-neon-medium)',
    borderColor: 'var(--neon-green)',
  }
};

export default function HubPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-12">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold text-brand-primary text-shadow-neon mb-6"
      >
        Bem-vindo ao Estúdio
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl text-text-secondary mb-16"
      >
        Escolha seu modo de produção.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full">
        
        <Link href="/sequencer" passHref>
          <motion.div
            className="flex flex-col items-center p-8 bg-surface-dark border-2 border-brand-primary/30 rounded-lg shadow-lg cursor-pointer h-full"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.5 }}
          >
            <Grid3x3 className="w-16 h-16 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Sequenciador
            </h2>
            <p className="text-text-secondary text-center">
              Crie batidas rapidamente no estilo clássico de step-sequencer. Perfeito para loops e ideias rápidas.
            </p>
          </motion.div>
        </Link>

        <Link href="/studio" passHref>
          <motion.div
            className="flex flex-col items-center p-8 bg-surface-dark border-2 border-brand-primary/30 rounded-lg shadow-lg cursor-pointer h-full"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.7 }}
          >
            <Layers className="w-16 h-16 text-brand-primary mb-6" />
            <h2 className="text-3xl font-bold text-text-primary mb-3">
              Estúdio de Arranjo
            </h2>
            <p className="text-text-secondary text-center">
              Produza músicas completas com uma timeline multi-track, arrastando e soltando seus áudios.
            </p>
          </motion.div>
        </Link>

      </div>
    </main>
  );
}