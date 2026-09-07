"use client";

import { useState } from "react";

// Lecteur Bunny Stream (lib 613852). Avant le clic : une image (poster) avec
// notre bouton play, sans lecteur Bunny derrière (sinon deux boutons play
// et un aperçu muet qui ne démarre pas toujours). Au clic : l'iframe est
// chargée avec autoplay et le son, le clic servant de geste utilisateur.
// Si l'ID est vide, affiche un bloc "Vidéo en cours de préparation".
export default function BunnyVideo({
  videoId,
  label = "Regarde cette vidéo",
  poster,
}: {
  videoId: string;
  label?: string;
  // Image de couverture. Par défaut, la miniature générée par Bunny.
  poster?: string;
}) {
  const [played, setPlayed] = useState(false);

  if (!videoId) {
    return (
      <div className="overflow-hidden rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-2">
        <div className="relative rounded-[12px] overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--group)]">
            <div className="text-center px-6">
              <div className="mac-icon lg g-blue mx-auto mb-4 w-16 h-16" style={{ borderRadius: "50%" }}>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[var(--fg2)] text-[17px] font-semibold">
                Vidéo en cours de préparation
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const posterUrl = poster ?? `https://vz-0fb759fa-b02.b-cdn.net/${videoId}/thumbnail.jpg`;
  const src = `https://iframe.mediadelivery.net/embed/613852/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`;

  return (
    <div className="overflow-hidden rounded-[16px] bg-[var(--card)] border-[0.5px] border-[var(--sep)] p-2">
      <div className="relative rounded-[12px] overflow-hidden aspect-video bg-black">
        {played ? (
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlayed(true)}
            aria-label={label}
            className="group absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/25" />
            <div className="relative w-20 h-20 rounded-full bg-[var(--accent)] shadow-lg shadow-[var(--accent-glow)] flex items-center justify-center mb-4 transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="relative text-lg text-white font-semibold drop-shadow">{label}</p>
          </button>
        )}
      </div>
    </div>
  );
}
