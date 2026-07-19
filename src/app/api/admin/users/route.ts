import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireOwner } from "@/lib/admin";
import { getAdminClient } from "@/lib/supabase";
import { createMagicLinkToken, getSessionEmail } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email, role, invited_by, created_at")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ users: data });
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const normalized = String(email).trim().toLowerCase();
    const invitedBy = await getSessionEmail();
    const supabase = getAdminClient();

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", normalized)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "Cet email fait déjà partie de l'équipe" },
        { status: 409 }
      );
    }

    const { data: user, error } = await supabase
      .from("admin_users")
      .insert({ email: normalized, role: "member", invited_by: invitedBy })
      .select("id, email, role, invited_by, created_at")
      .single();
    if (error) throw error;

    // Email d'invitation avec un lien de connexion direct (valide 1h) et
    // un rappel du lien /membres si le lien expire.
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    let emailSent = false;
    if (BREVO_API_KEY) {
      const token = await createMagicLinkToken(normalized);
      const magicLink = `${req.nextUrl.origin}/api/auth/verify?token=${token}`;
      const loginPage = `${req.nextUrl.origin}/membres`;

      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Jeremy Pitault", email: "contact@jeremypitault.com" },
          to: [{ email: normalized }],
          tags: ["admin-invitation"],
          subject: "Tu as été invité sur l'admin App Mastery",
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="color: #111; font-size: 20px;">Accès à l'admin App Mastery</h2>
              <p style="color: #555; font-size: 15px; line-height: 1.6;">
                ${invitedBy || "Jeremy"} t'a donné accès à l'espace admin d'App Mastery
                (candidatures et CRM). Clique sur le bouton ci-dessous pour te connecter.
                Ce lien expire dans 1 heure.
              </p>
              <a href="${magicLink}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px;">
                Accéder à l'admin
              </a>
              <p style="color: #555; font-size: 13px; line-height: 1.6; margin-top: 24px;">
                Lien expiré ? Va sur <a href="${loginPage}" style="color: #0ea5e9;">${loginPage}</a>,
                entre ton email (${normalized}) et tu recevras un nouveau lien de connexion.
                Une fois connecté, l'admin est disponible sur
                <a href="${req.nextUrl.origin}/admin/crm" style="color: #0ea5e9;">/admin/crm</a> et
                <a href="${req.nextUrl.origin}/admin/candidatures" style="color: #0ea5e9;">/admin/candidatures</a>.
              </p>
            </div>
          `,
        }),
      });
      emailSent = res.ok;
      if (!res.ok) console.error("Brevo invitation error:", await res.json());
    }

    return NextResponse.json({ user, emailSent });
  } catch (err) {
    console.error("Invite user error:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireOwner();
  } catch {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Id manquant" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data: target } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", id)
      .maybeSingle();
    if (!target) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }
    if (target.role === "owner") {
      return NextResponse.json(
        { error: "Impossible de supprimer le propriétaire" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
