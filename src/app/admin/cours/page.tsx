"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Upload,
  Paperclip,
  FileText,
  X,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TipTapEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-white/5 border border-white/10 rounded-lg animate-pulse" />
  ),
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Attachment {
  id: string;
  name: string;
  file_path: string;
  file_size: number | null;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  bunny_video_id: string;
  position: number;
  attachments: Attachment[];
}

interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable Module Row                                                */
/* ------------------------------------------------------------------ */

function SortableModuleRow({
  mod,
  isSelected,
  isEditing,
  moduleTitle,
  setModuleTitle,
  savingModule,
  onSelect,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
}: {
  mod: Module;
  isSelected: boolean;
  isEditing: boolean;
  moduleTitle: string;
  setModuleTitle: (v: string) => void;
  savingModule: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: mod.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="p-2 space-y-2">
        <input
          type="text"
          value={moduleTitle}
          onChange={(e) => setModuleTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onCancelEdit();
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={savingModule}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {savingModule ? <Spinner /> : <><Save size={12} /> Enregistrer</>}
          </button>
          <button
            onClick={onCancelEdit}
            className="px-2 py-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-sky-500/10 text-sky-400"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
      onClick={onSelect}
    >
      <GripVertical
        size={14}
        className="text-gray-600 shrink-0 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      />
      <span className="flex-1 text-sm font-medium truncate">{mod.title}</span>
      <span className="text-xs text-gray-500 shrink-0">{mod.lessons.length}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        title="Modifier"
      >
        <Pencil size={12} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
        title="Supprimer"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable Lesson Row                                                */
/* ------------------------------------------------------------------ */

function SortableLessonRow({
  lesson,
  isSelected,
  onSelect,
  onDelete,
}: {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-sky-500/10 text-sky-400"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
      onClick={onSelect}
    >
      <GripVertical
        size={14}
        className="text-gray-600 shrink-0 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{lesson.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {lesson.description && <FileText size={10} className="text-gray-500" />}
          {lesson.bunny_video_id && (
            <span className="text-[10px] text-gray-500">Vidéo</span>
          )}
        </div>
      </div>
      <ChevronRight size={14} className="text-gray-600 shrink-0" />
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
        title="Supprimer"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AdminCoursPage() {
  /* ---- auth ---- */
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  /* ---- data ---- */
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---- selection ---- */
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  /* ---- module form ---- */
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  /* ---- lesson form ---- */
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [lessonForm, setLessonForm] = useState<{
    title: string;
    description: string;
    bunny_video_id: string;
  } | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);

  /* ---- attachments ---- */
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- saving states ---- */
  const [savingModule, setSavingModule] = useState(false);

  /* ---- dnd sensors ---- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /* ================================================================ */
  /*  Derived                                                          */
  /* ================================================================ */

  const selectedModule = modules.find((m) => m.id === selectedModuleId) ?? null;
  const selectedLesson =
    selectedModule?.lessons.find((l) => l.id === selectedLessonId) ?? null;

  /* ================================================================ */
  /*  Auth check                                                       */
  /* ================================================================ */

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        if (d.admin) {
          setAuthorized(true);
        } else {
          window.location.href = "/membres";
        }
      })
      .catch(() => {
        window.location.href = "/membres";
      });
  }, []);

  /* ================================================================ */
  /*  Fetch all data                                                   */
  /* ================================================================ */

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch modules
      const modRes = await fetch("/api/admin/modules");
      const modJson = await modRes.json();
      const mods: Module[] = (modJson.data ?? []).map(
        (m: { id: string; title: string; position: number }) => ({
          ...m,
          lessons: [] as Lesson[],
        })
      );

      // 2. For each module fetch lessons
      await Promise.all(
        mods.map(async (mod) => {
          const lesRes = await fetch(
            `/api/admin/lessons?module_id=${mod.id}`
          );
          const lesJson = await lesRes.json();
          mod.lessons = (lesJson.data ?? []).map(
            (l: Lesson) => ({ ...l, attachments: [] as Attachment[] })
          );
        })
      );

      mods.sort((a, b) => a.position - b.position);
      mods.forEach((m) => m.lessons.sort((a, b) => a.position - b.position));

      setModules(mods);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) fetchData();
  }, [authorized, fetchData]);

  /* ================================================================ */
  /*  Fetch attachments for selected lesson                           */
  /* ================================================================ */

  const fetchAttachments = useCallback(async (lessonId: string) => {
    try {
      const res = await fetch(
        `/api/admin/attachments?lesson_id=${lessonId}`
      );
      const json = await res.json();
      setAttachments(json.data ?? []);
    } catch {
      setAttachments([]);
    }
  }, []);

  useEffect(() => {
    if (selectedLessonId) {
      fetchAttachments(selectedLessonId);
    } else {
      setAttachments([]);
    }
  }, [selectedLessonId, fetchAttachments]);

  /* ================================================================ */
  /*  Module CRUD                                                      */
  /* ================================================================ */

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setSavingModule(true);
    try {
      const maxPos = modules.reduce((max, m) => Math.max(max, m.position), 0);
      await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newModuleTitle.trim(), position: maxPos + 1 }),
      });
      setNewModuleTitle("");
      setAddingModule(false);
      await fetchData();
    } finally {
      setSavingModule(false);
    }
  };

  const handleUpdateModule = async (id: string) => {
    if (!moduleTitle.trim()) return;
    setSavingModule(true);
    try {
      const mod = modules.find((m) => m.id === id);
      await fetch("/api/admin/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: moduleTitle.trim(), position: mod?.position }),
      });
      setEditingModuleId(null);
      await fetchData();
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!window.confirm("Supprimer ce module et toutes ses leçons ?")) return;
    await fetch(`/api/admin/modules?id=${id}`, { method: "DELETE" });
    if (selectedModuleId === id) {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
      setLessonForm(null);
    }
    await fetchData();
  };

  /* ================================================================ */
  /*  Lesson CRUD                                                      */
  /* ================================================================ */

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim() || !selectedModuleId) return;
    setSavingLesson(true);
    try {
      const mod = modules.find((m) => m.id === selectedModuleId);
      const maxPos = (mod?.lessons ?? []).reduce(
        (max, l) => Math.max(max, l.position),
        0
      );
      await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: selectedModuleId,
          title: newLessonTitle.trim(),
          description: "",
          bunny_video_id: "",
          position: maxPos + 1,
        }),
      });
      setNewLessonTitle("");
      setAddingLesson(false);
      await fetchData();
    } finally {
      setSavingLesson(false);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      description: lesson.description ?? "",
      bunny_video_id: lesson.bunny_video_id ?? "",
    });
  };

  const handleSaveLesson = async () => {
    if (!selectedLessonId || !lessonForm) return;
    setSavingLesson(true);
    try {
      const lesson = selectedModule?.lessons.find((l) => l.id === selectedLessonId);
      await fetch("/api/admin/lessons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLessonId,
          ...lessonForm,
          position: lesson?.position ?? 0,
        }),
      });
      await fetchData();
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!window.confirm("Supprimer cette leçon ?")) return;
    await fetch(`/api/admin/lessons?id=${id}`, { method: "DELETE" });
    if (selectedLessonId === id) {
      setSelectedLessonId(null);
      setLessonForm(null);
    }
    await fetchData();
  };

  /* ================================================================ */
  /*  Attachments                                                      */
  /* ================================================================ */

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLessonId) return;
    setUploading(true);
    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lesson_id", selectedLessonId);
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();

      if (uploadRes.ok) {
        // 2. Create attachment record
        await fetch("/api/admin/attachments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lesson_id: selectedLessonId,
            name: uploadJson.name,
            file_path: uploadJson.file_path,
            file_size: uploadJson.file_size,
          }),
        });
        await fetchAttachments(selectedLessonId);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAttachment = async (id: string) => {
    if (!window.confirm("Supprimer cette pièce jointe ?")) return;
    await fetch(`/api/admin/attachments?id=${id}`, { method: "DELETE" });
    if (selectedLessonId) await fetchAttachments(selectedLessonId);
  };

  /* ================================================================ */
  /*  Reorder handlers                                                 */
  /* ================================================================ */

  const handleModuleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(modules, oldIndex, newIndex);

    // Optimistic update
    setModules(reordered);

    // Persist
    const items = reordered.map((m, i) => ({ id: m.id, position: i + 1 }));
    await fetch("/api/admin/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "modules", items }),
    });
  };

  const handleLessonDragEnd = async (event: DragEndEvent) => {
    if (!selectedModule) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const lessons = selectedModule.lessons;
    const oldIndex = lessons.findIndex((l) => l.id === active.id);
    const newIndex = lessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(lessons, oldIndex, newIndex);

    // Optimistic update
    setModules((prev) =>
      prev.map((m) =>
        m.id === selectedModule.id ? { ...m, lessons: reordered } : m
      )
    );

    // Persist
    const items = reordered.map((l, i) => ({ id: l.id, position: i + 1 }));
    await fetch("/api/admin/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: "lessons", items }),
    });
  };

  /* ================================================================ */
  /*  Render: loading / unauthorized                                   */
  /* ================================================================ */

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  /* ================================================================ */
  /*  Render: main layout                                              */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gray-950 text-white antialiased">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-semibold tracking-widest uppercase text-sky-400">
            Admin
          </span>
          <h1 className="text-xl font-bold tracking-tight">
            Gestion des cours
          </h1>
        </div>
        <a
          href="/membres/cours"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Voir le cours &rarr;
        </a>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* ============================================================ */}
        {/*  LEFT: Modules list                                          */}
        {/* ============================================================ */}
        <aside className="w-72 shrink-0 border-r border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Modules
            </h2>
            <button
              onClick={() => {
                setAddingModule(true);
                setNewModuleTitle("");
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 text-sky-400 transition-colors"
              title="Ajouter un module"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add module form */}
          {addingModule && (
            <div className="p-3 border-b border-white/10 space-y-2">
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Titre du module"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddModule();
                  if (e.key === "Escape") setAddingModule(false);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddModule}
                  disabled={savingModule}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {savingModule ? <Spinner /> : <><Plus size={14} /> Ajouter</>}
                </button>
                <button
                  onClick={() => setAddingModule(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Module list */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleModuleDragEnd}
            >
              <SortableContext
                items={modules.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-2 space-y-1">
                  {modules.map((mod) => (
                    <SortableModuleRow
                      key={mod.id}
                      mod={mod}
                      isSelected={selectedModuleId === mod.id}
                      isEditing={editingModuleId === mod.id}
                      moduleTitle={moduleTitle}
                      setModuleTitle={setModuleTitle}
                      savingModule={savingModule}
                      onSelect={() => {
                        setSelectedModuleId(mod.id);
                        setSelectedLessonId(null);
                        setLessonForm(null);
                      }}
                      onEdit={() => {
                        setEditingModuleId(mod.id);
                        setModuleTitle(mod.title);
                      }}
                      onSave={() => handleUpdateModule(mod.id)}
                      onCancelEdit={() => setEditingModuleId(null)}
                      onDelete={() => handleDeleteModule(mod.id)}
                    />
                  ))}

                  {modules.length === 0 && !loading && (
                    <p className="text-center text-gray-500 text-sm py-8">
                      Aucun module. Cliquez sur + pour en créer un.
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </aside>

        {/* ============================================================ */}
        {/*  CENTER: Lessons list                                        */}
        {/* ============================================================ */}
        <div className="w-80 shrink-0 border-r border-white/10 overflow-y-auto">
          {selectedModule ? (
            <>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                    Leçons
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedModule.title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAddingLesson(true);
                    setNewLessonTitle("");
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-sky-400 transition-colors"
                  title="Ajouter une leçon"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add lesson form */}
              {addingLesson && (
                <div className="p-3 border-b border-white/10 space-y-2">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="Titre de la leçon"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-sky-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddLesson();
                      if (e.key === "Escape") setAddingLesson(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddLesson}
                      disabled={savingLesson}
                      className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {savingLesson ? (
                        <Spinner />
                      ) : (
                        <>
                          <Plus size={14} /> Ajouter
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setAddingLesson(false)}
                      className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Lesson list */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleLessonDragEnd}
              >
                <SortableContext
                  items={selectedModule.lessons.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="p-2 space-y-1">
                    {selectedModule.lessons.map((lesson) => (
                      <SortableLessonRow
                        key={lesson.id}
                        lesson={lesson}
                        isSelected={selectedLessonId === lesson.id}
                        onSelect={() => handleSelectLesson(lesson)}
                        onDelete={() => handleDeleteLesson(lesson.id)}
                      />
                    ))}

                    {selectedModule.lessons.length === 0 && (
                      <p className="text-center text-gray-500 text-sm py-8">
                        Aucune leçon. Cliquez sur + pour en créer une.
                      </p>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm px-6 text-center">
              Sélectionnez un module pour voir ses leçons.
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/*  RIGHT: Lesson detail / edit                                 */}
        {/* ============================================================ */}
        <main className="flex-1 overflow-y-auto">
          {selectedLesson && lessonForm ? (
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Modifier la leçon</h2>
                <button
                  onClick={() => {
                    setSelectedLessonId(null);
                    setLessonForm(null);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Titre
                </label>
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, title: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Bunny Video ID */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Bunny Video ID
                </label>
                <input
                  type="text"
                  value={lessonForm.bunny_video_id}
                  onChange={(e) =>
                    setLessonForm({
                      ...lessonForm,
                      bunny_video_id: e.target.value,
                    })
                  }
                  placeholder="ex: abc123-def456"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500 transition-colors font-mono text-sm"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-400">
                  Description
                </label>
                <TipTapEditor
                  content={lessonForm.description}
                  onChange={(html) =>
                    setLessonForm({
                      ...lessonForm,
                      description: html,
                    })
                  }
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSaveLesson}
                disabled={savingLesson}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingLesson ? (
                  <Spinner />
                ) : (
                  <>
                    <Save size={16} /> Enregistrer
                  </>
                )}
              </button>

              {/* ---------------------------------------------------- */}
              {/*  Attachments                                          */}
              {/* ---------------------------------------------------- */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Paperclip size={14} />
                  Pièces jointes
                </h3>

                {/* Attachment list */}
                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3"
                      >
                        <FileText size={16} className="text-sky-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {att.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(att.file_size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Aucune pièce jointe pour cette leçon.
                  </p>
                )}

                {/* Upload */}
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Spinner /> Téléchargement...
                      </>
                    ) : (
                      <>
                        <Upload size={14} /> Ajouter une pièce jointe
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              Sélectionnez une leçon pour la modifier.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
