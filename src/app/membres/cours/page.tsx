"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getEmbedUrl } from "@/lib/cours";
import { Paperclip, Download } from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  file_path: string;
  file_size: number | null;
}

interface LessonData {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  bunny_video_id: string;
  position: number;
  attachments: Attachment[];
}

interface ModuleData {
  id: string;
  title: string;
  position: number;
  lessons: LessonData[];
}

const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/lesson-attachments`;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
}

export default function CoursPage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const descRef = useRef<HTMLDivElement>(null);

  const injectCopyButtons = useCallback(() => {
    if (!descRef.current) return;
    const blocks = descRef.current.querySelectorAll<HTMLElement>("pre, blockquote");
    blocks.forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copier";
      btn.addEventListener("click", () => {
        const text = block.textContent?.replace(/^Copier/, "").replace(/^Copié !/, "").trim() || "";
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copié !";
          btn.classList.add("copied");
          setTimeout(() => {
            btn.textContent = "Copier";
            btn.classList.remove("copied");
          }, 2000);
        });
      });
      block.style.position = "relative";
      block.appendChild(btn);
    });
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (res.ok) {
          setAuthenticated(true);
          const coursRes = await fetch("/api/cours");
          const data = await coursRes.json();
          const mods: ModuleData[] = data.modules || [];
          setModules(mods);
          const savedId = localStorage.getItem("currentLessonId");
          const saved = savedId && mods.flatMap((m) => m.lessons).find((l) => l.id === savedId);
          setCurrentLesson(saved || mods[0]?.lessons[0] || null);
        } else {
          window.location.href = "/membres";
        }
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  useEffect(() => {
    if (currentLesson) localStorage.setItem("currentLessonId", currentLesson.id);
    injectCopyButtons();
  }, [currentLesson, injectCopyButtons]);

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
              {currentLesson.bunny_video_id ? (
                <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={getEmbedUrl(currentLesson.bunny_video_id)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center bg-gray-900 border-b border-white/10" style={{ paddingTop: "56.25%" }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-12 h-12 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <p className="text-sm">Vidéo bientôt disponible</p>
                  </div>
                </div>
              )}

              {/* Lesson info */}
              <div className="p-6 lg:p-10">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  {currentLesson.title}
                </h1>

                {/* Description */}
                {currentLesson.description && (
                  <div
                    ref={descRef}
                    className="lesson-description mt-6 text-gray-300 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ __html: currentLesson.description }}
                  />
                )}

                {/* Attachments */}
                {currentLesson.attachments && currentLesson.attachments.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Pièces jointes
                    </h2>
                    <div className="space-y-3">
                      {currentLesson.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={`${STORAGE_BASE}/${attachment.file_path}`}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-white/10 transition-colors group"
                        >
                          <Paperclip className="w-5 h-5 text-gray-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {attachment.name}
                            </p>
                            {attachment.file_size != null && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {formatFileSize(attachment.file_size)}
                              </p>
                            )}
                          </div>
                          <Download className="w-5 h-5 text-gray-500 group-hover:text-sky-400 transition-colors shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
