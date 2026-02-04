import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

const videos = [
  {
    id: 'genset',
    title: 'Genset Overview',
    description: 'Comprehensive look at our diesel generator sets.',
    embedUrl: 'https://drive.google.com/file/d/1qIVRxUWR6TgLmPzE7kBQVOyFRzTrkTwl/preview',
  },
  {
    id: 'better-power',
    title: 'Better Power Solutions',
    description: 'How WCPL delivers superior power reliability.',
    embedUrl: 'https://drive.google.com/file/d/1rVmrNg_I5wWcQy_RoskYalf0oNDqvaEB/preview',
  },
  {
    id: 'optiprime',
    title: 'Optiprime Series',
    description: 'Advanced features of our Optiprime generators.',
    embedUrl: 'https://drive.google.com/file/d/1t2i2M3rgN1C5pakeP9C7KJ5SkEUUNayO/preview',
  },
];

export const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="line-accent" />
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">
              Video Gallery
            </span>
            <div className="line-accent" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            See Us In
            <span className="text-primary"> Action</span>
          </h2>
        </motion.div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card-industrial rounded-lg overflow-hidden"
            >
              {/* Video Thumbnail */}
              <div 
                className="aspect-video bg-card relative cursor-pointer group"
                onClick={() => setActiveVideo(video.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Thumbnail Placeholder */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <span className="text-xs text-foreground-muted bg-background/80 px-2 py-1 rounded">
                    Click to play
                  </span>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {video.title}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-card border border-border rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Google Drive Video Embed */}
            <iframe
              src={videos.find(v => v.id === activeVideo)?.embedUrl}
              className="w-full h-full"
              allow="autoplay"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};
