import { motion } from 'framer-motion';

const stats = [
  { value: '60+', label: 'Years Engineering' },
  { value: '100,000+', label: 'Installations' },
  { value: '24/7', label: 'Support' },
];

export const HeroStats = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="flex items-center gap-6 md:gap-10"
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-6 md:gap-10">
          <div className="text-center md:text-left">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] md:text-xs text-white/40 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-10 bg-white/10" />
          )}
        </div>
      ))}
    </motion.div>
  );
};
