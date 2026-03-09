"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { modules, getEmbedUrl } from "@/lib/cours";
import type { Lesson } from "@/lib/cours";

export default function CoursPage() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          if (modules[0]?.lessons[0]) {
            setCurrentLesson(modules[0].lessons[0]);
          }
        } else {
          window.location.href = "/membres";
        }
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-r border-white/10 bg-gray-950 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <span className="font-mono text-xs font-semibold tracking-widest uppercase text-sky-400">
              App Mastery
            </span>
            <h2 className="mt-1 text-lg font-semibold text-white tracking-tight">
              Essentiel
            </h2>
          </div>

          <nav className="flex-1 p-4 space-y-6">
            {modules.map((mod) => (
              <div key={mod.id}>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-gray-500 px-3 mb-2">
                  {mod.title}
                </h3>
                <div className="space-y-1">
                  {mod.lessons.map((lesson, i) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors cursor-pointer ${
                        currentLesson?.id === lesson.id
                          ? "bg-sky-500/10 text-sky-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-medium shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate">{lesson.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden border-b border-white/10 p-4">
            <span className="font-mono text-xs font-semibold tracking-widest uppercase text-sky-400">
              App Mastery Essentiel
            </span>
            <select
              className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
              value={currentLesson?.id || ""}
              onChange={(e) => {
                for (const mod of modules) {
                  const lesson = mod.lessons.find((l) => l.id === e.target.value);
                  if (lesson) {
                    setCurrentLesson(lesson);
                    break;
                  }
                }
              }}
            >
              {modules.map((mod) =>
                mod.lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {mod.title} - {lesson.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {currentLesson && (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video player */}
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={getEmbedUrl(currentLesson.bunnyVideoId)}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Lesson info */}
              <div className="p-6 lg:p-10">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {currentLesson.title}
                </h1>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
