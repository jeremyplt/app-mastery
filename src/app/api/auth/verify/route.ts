import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createSessionToken } from "@/lib/auth";

// En dev, req.url porte l'adresse d'écoute du serveur (0.0.0.0), injoignable
// depuis le navigateur : on redirige vers l'hôte réellement demandé.
function siteUrl(req: NextRequest, path: string): URL {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return new URL(path, host ? `${req.nextUrl.protocol}//${host}` : req.url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(siteUrl(req, "/membres?error=missing"));
  }

  const result = await verifyToken(token);
  if (!result) {
    return NextResponse.redirect(siteUrl(req, "/membres?error=expired"));
  }

  const sessionToken = await createSessionToken(result.email);

  const response = NextResponse.redirect(
    siteUrl(req, "/membres/cours")
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
