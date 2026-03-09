import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/membres?error=missing", req.url));
  }

  const result = await verifyToken(token);
  if (!result) {
    return NextResponse.redirect(new URL("/membres?error=expired", req.url));
  }

  const sessionToken = await createSessionToken(result.email);

  const response = NextResponse.redirect(
    new URL("/membres/cours", req.url)
  );
  response.cookies.set("session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}
