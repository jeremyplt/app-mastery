"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const videos = [
  "/proof/influencer-videos/viral-1.mp4",
  "/proof/influencer-videos/viral-2.mp4",
  "/proof/influencer-videos/viral-3.mp4",
  "/proof/influencer-videos/viral-4.mp4",
  "/proof/influencer-videos/viral-5.mp4",
  "/proof/influencer-videos/viral-6.mp4",
];

function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullPlaying, setIsFullPlaying] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.loop = false;
    video.play();
    setIsFullPlaying(true);
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.currentTime = 0;
    video.play();
    setIsFullPlaying(false);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] shrink-0 w-52 cursor-pointer"
      onClick={!isFullPlaying ? handlePlay : undefined}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        controls={isFullPlaying}
        onEnded={handleEnded}
      />
      {!isFullPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Triple the videos to ensure enough width for seamless loop
const marqueeItems = [...videos, ...videos, ...videos];

export default function ProofViralV4() {
  return (
    <section className="relative py-20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-pink-400">
            Contenu viral
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="mb-12 max-w-2xl">
          <motion.h2
            className="text-[2.5rem]/10 font-medium tracking-tighter text-balance text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            On t&apos;apprend à transformer tes influenceurs en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
              machines à contenus viraux
            </span>
          </motion.h2>
          <motion.p
            className="mt-4 text-base/7 text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Trouver un influenceur, c&apos;est 10% du travail. Les 90% restants,
            c&apos;est le former pour qu&apos;il produise du contenu qui explose.
            On te donne le process exact pour briefer, cadrer et obtenir des
            vidéos qui génèrent des millions de vues. Voici les résultats.
          </motion.p>
        </div>
      </div>

      {/* Infinite marquee using Framer Motion */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10" />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((src, i) => (
            <VideoCard key={i} src={src} />
          ))}
        </motion.div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <motion.p
          className="mt-10 text-center text-xl sm:text-2xl font-medium tracking-tight text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Plusieurs millions de vues cumulées sur TikTok, Instagram Reels et YouTube Shorts
        </motion.p>
      </div>

      <div className="relative mt-20 before:absolute before:top-0 before:h-px before:w-[200vw] before:-left-[100vw] before:bg-white/10" />
    </section>
  );
}
