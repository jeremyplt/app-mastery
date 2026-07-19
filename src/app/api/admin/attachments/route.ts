import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin";

export async function GET(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lesson_id");

    if (!lessonId) {
      return NextResponse.json(
        { error: "lesson_id requis" },
        { status: 400 }
      );
    }

    const { data, error } = await db
      .from("attachments")
      .select("*")
      .eq("lesson_id", lessonId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const { lesson_id, name, file_path, file_size } = await req.json();

    const { data, error } = await db
      .from("attachments")
      .insert({ lesson_id, name, file_path, file_size })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }

    // Fetch the attachment to get the file path before deleting
    const { data: attachment, error: fetchError } = await db
      .from("attachments")
      .select("file_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete the file from storage
    if (attachment?.file_path) {
      const { error: storageError } = await db.storage
        .from("lesson-attachments")
        .remove([attachment.file_path]);

      if (storageError) {
        console.error(
          "Erreur lors de la suppression du fichier:",
          storageError
        );
      }
    }

    // Delete the database record
    const { error } = await db.from("attachments").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}
