import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import Stripe from "stripe";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

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
    const sessions = await stripe.checkout.sessions.list({
      customer_details: { email },
      status: "complete",
      limit: 100,
    } as Stripe.Checkout.SessionListParams);

    for (const session of sessions.data) {
      if (session.payment_status === "paid") {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Stripe verification error:", err);
    return false;
  }
}
