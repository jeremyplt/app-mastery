import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch all modules ordered by position
    const { data: modules, error: modulesError } = await supabase
      .from("modules")
      .select("id, title, position")
      .order("position", { ascending: true });

    if (modulesError) {
      return NextResponse.json(
        { error: modulesError.message },
        { status: 500 }
      );
    }

    if (!modules || modules.length === 0) {
      return NextResponse.json({ modules: [] });
    }

    // Fetch all lessons ordered by position
    const moduleIds = modules.map((m) => m.id);
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id, module_id, title, description, bunny_video_id, position")
      .in("module_id", moduleIds)
      .order("position", { ascending: true });

    if (lessonsError) {
      return NextResponse.json(
        { error: lessonsError.message },
        { status: 500 }
      );
    }

    // Fetch all attachments for those lessons
    const lessonIds = (lessons || []).map((l) => l.id);
    let attachments: { id: string; lesson_id: string; name: string; file_path: string; file_size: number }[] = [];

    if (lessonIds.length > 0) {
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from("lesson_attachments")
        .select("id, lesson_id, name, file_path, file_size")
        .in("lesson_id", lessonIds);

      if (attachmentsError) {
        return NextResponse.json(
          { error: attachmentsError.message },
          { status: 500 }
        );
      }

      attachments = attachmentsData || [];
    }

    // Assemble the nested structure
    const result = modules.map((mod) => ({
      ...mod,
      lessons: (lessons || [])
        .filter((l) => l.module_id === mod.id)
        .map((lesson) => ({
          ...lesson,
          attachments: attachments.filter((a) => a.lesson_id === lesson.id),
        })),
    }));

    return NextResponse.json({ modules: result });
  } catch (err) {
    console.error("Erreur lors du chargement des cours:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
