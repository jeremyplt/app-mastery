import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lessonId = formData.get("lesson_id") as string | null;

    if (!file || !lessonId) {
      return NextResponse.json(
        { error: "Fichier et lesson_id requis" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const filePath = `${lessonId}/${timestamp}-${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await db.storage
      .from("lesson-attachments")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = db.storage.from("lesson-attachments").getPublicUrl(filePath);

    return NextResponse.json({
      file_path: filePath,
      public_url: publicUrl,
      file_size: file.size,
      name: file.name,
    });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}
