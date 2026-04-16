import { motion } from 'framer-motion';
import kirloskarLogo from '@/assets/kirloskar-logo.png';

export const KoelBadge = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute bottom-6 right-4 md:bottom-10 md:right-10 hidden sm:block z-10"
    >
      <div className="bg-black/50 backdrop-blur-xl border border-white/[0.08] rounded-xl px-5 py-3.5 flex items-center gap-4 shadow-2xl">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
          <img src={kirloskarLogo} alt="Kirloskar" className="w-full h-full object-contain" />
        </div>
        <div>
          <div className="text-[9px] leading-tight font-semibold text-white/50 uppercase tracking-[0.15em]">
            Authorized GOEM
          </div>
          <div className="text-sm font-bold text-white tracking-wide">
            of KOEL
          </div>
        </div>
      </div>
    </motion.div>
  );
};
