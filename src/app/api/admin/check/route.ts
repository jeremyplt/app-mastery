import { NextResponse } from "next/server";
import { getAdminRole } from "@/lib/admin";

export async function GET() {
  try {
    const role = await getAdminRole();
    return NextResponse.json({ admin: role !== null, role });
  } catch {
    return NextResponse.json({ admin: false, role: null });
  }
}
