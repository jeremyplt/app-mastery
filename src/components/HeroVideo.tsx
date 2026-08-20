"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

// Autoplay preview (first seconds, muted, looping) with click to play full video
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.loop = false;
    video.play();
    setIsPlaying(true);
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.currentTime = 0;
    video.play();
    setIsPlaying(false);
  };

  return (
    <section className="relative py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="isolate overflow-hidden rounded-[16px] border-[0.5px] border-[var(--sep)] bg-[var(--card)] p-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-pointer"
              onClick={!isPlaying ? handlePlay : undefined}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="/videos/vsl.mp4"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                controls={isPlaying}
                onEnded={handleEnded}
              />

              {/* Play overlay — hidden once playing with sound */}
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--accent)_25%,transparent)] backdrop-blur-sm flex items-center justify-center mb-4 hover:bg-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-colors">
                    <svg
                      className="w-7 h-7 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-base text-white font-medium">
                    Regarde cette vidéo (3 min)
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.p
            className="mt-4 text-center text-lg font-medium italic text-[var(--fg2)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Regarde cette vidéo de 3 minutes pour comprendre comment ça marche
          </motion.p>
        </div>
      </div>
    </section>
  );
}
