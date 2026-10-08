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

// Session sans date d'expiration : on reste connecté pour toujours.
export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).sign(SECRET);
}

// Les navigateurs plafonnent la durée d'un cookie à 400 jours. Le cookie est
// renouvelé à chaque visite de l'admin (/api/admin/check), il n'expire donc
// jamais tant qu'on revient au moins une fois tous les 400 jours.
export const SESSION_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 400,
  path: "/",
};

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
