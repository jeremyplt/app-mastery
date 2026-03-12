import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

export async function createMagicLinkToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(SECRET);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

export async function getSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const result = await verifyToken(token);
  return result?.email || null;
}

export async function hasEssentielAccess(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.lemonsqueezy.com/v1/orders?filter[user_email]=${encodeURIComponent(email)}`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          Authorization: `Bearer ${process.env.LS_API_KEY}`,
        },
      }
    );

    if (!res.ok) return false;

    const data = await res.json();
    return data.data && data.data.length > 0;
  } catch (err) {
    console.error("Lemon Squeezy verification error:", err);
    return false;
  }
}
