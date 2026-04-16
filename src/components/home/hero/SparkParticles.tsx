import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

export const SparkParticles = () => {
  const sparks = useMemo<Spark[]>(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 50, // cluster toward right-center (where welding glow is)
      y: 20 + Math.random() * 60,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      drift: -30 + Math.random() * 60,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute rounded-full"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
            background: `radial-gradient(circle, rgba(255,200,100,0.9) 0%, rgba(255,120,30,0.6) 50%, transparent 100%)`,
            boxShadow: `0 0 ${spark.size * 2}px rgba(255,160,50,0.4)`,
          }}
          animate={{
            y: [0, -80 - Math.random() * 120],
            x: [0, spark.drift],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 0.8, 0],
          }}
          transition={{
            duration: spark.duration,
            delay: spark.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
