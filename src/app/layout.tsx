import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App Secrets - Cree, Lance et Monetise ton App Mobile en 28 Jours",
  description:
    "La formation complete pour creer une application mobile rentable de A a Z avec l'IA et le vibecoding. 14 modules, 90+ lecons. Meme sans experience en programmation.",
  openGraph: {
    title: "App Secrets - Cree ton App Mobile en 28 Jours",
    description:
      "Transforme ton idee en application rentable sur l'App Store et Google Play grace a l'IA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
