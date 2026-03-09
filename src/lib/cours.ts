export interface Lesson {
  id: string;
  title: string;
  bunnyVideoId: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Bunny Stream config
export const BUNNY_LIBRARY_ID = "613852";
export const BUNNY_CDN_HOST = "vz-0fb759fa-b02.b-cdn.net";

export function getEmbedUrl(videoId: string): string {
  return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=false&preload=true&responsive=true`;
}

// Course content - add your modules and lessons here
export const modules: Module[] = [
  {
    id: "module-1",
    title: "Module 1 - Les Fondations",
    lessons: [
      {
        id: "1-1",
        title: "PRD & Cursor",
        bunnyVideoId: "2f0bb615-8304-48e3-a7b4-281b4482c97b",
      },
    ],
  },
];

export function getLesson(lessonId: string): { module: Module; lesson: Lesson } | null {
  for (const mod of modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: mod, lesson };
  }
  return null;
}
