import { motion } from 'framer-motion';

export const AssemblyParts = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Engine block */}
      <motion.div
        className="absolute w-32 h-24 border-2 border-primary/40 rounded-md bg-primary/5"
        initial={{ x: -200, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
      />
      {/* Radiator */}
      <motion.div
        className="absolute w-20 h-28 border-2 border-primary/30 rounded-sm bg-primary/5"
        style={{ left: '55%' }}
        initial={{ x: 200, opacity: 0, rotate: 10 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      />
      {/* Control panel */}
      <motion.div
        className="absolute w-16 h-16 border-2 border-primary/40 rounded bg-primary/10"
        style={{ top: '20%', right: '30%' }}
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
      />
      {/* Base frame */}
      <motion.div
        className="absolute bottom-[30%] w-48 h-4 border-2 border-primary/30 rounded-sm bg-primary/5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      />
      {/* Exhaust */}
      <motion.div
        className="absolute w-6 h-20 border-2 border-primary/20 rounded-full bg-primary/5"
        style={{ top: '15%', left: '40%' }}
        initial={{ y: -100, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};
