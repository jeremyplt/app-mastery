import type { Metadata, Viewport } from "next";

// L'admin s'ajoute à l'écran d'accueil du téléphone et s'ouvre alors comme une
// app : plein écran, sans barre Safari, avec sa propre icône et son nom.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  manifest: "/admin.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "AM Admin", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceef2" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-app">{children}</div>;
}
