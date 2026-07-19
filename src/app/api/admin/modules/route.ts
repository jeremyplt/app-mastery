import { NextRequest, NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase";
import { requireOwner } from "@/lib/admin";

export async function GET() {
  try {
    await requireOwner();
    const db = getAdminClient();

    const { data, error } = await db
      .from("modules")
      .select("*")
      .order("position", { ascending: true });

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
    const { title, position } = await req.json();

    const { data, error } = await db
      .from("modules")
      .insert({ title, position })
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

export async function PUT(req: NextRequest) {
  try {
    await requireOwner();
    const db = getAdminClient();
    const { id, title, position } = await req.json();

    const { data, error } = await db
      .from("modules")
      .update({ title, position })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
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

    const { error } = await db.from("modules").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}
