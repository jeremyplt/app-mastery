import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat } from "next/font/google";
import { PostHogProvider } from "./posthog-provider";
import { MetaPixelProvider } from "./meta-pixel-provider";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jeremy Pitault - Crée ton app mobile rentable avec l'IA",
  description:
    "Développeur d'apps mobiles et créateur de Shinobi Japanese. Je t'accompagne pour créer, lancer et monétiser une app rentable avec l'IA, même sans savoir coder.",
  openGraph: {
    title: "Jeremy Pitault - Crée ton app mobile rentable avec l'IA",
    description:
      "Transforme ton idée en application rentable sur l'App Store et Google Play grâce à l'IA. Réserve un appel pour en parler.",
    type: "website",
  },
  other: {
    "facebook-domain-verification": "jyv3yrlmzy0twdapkaplq3c50mfq5i",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${caveat.variable} antialiased`}
      >
        <MetaPixelProvider />
        <PostHogProvider>
          <MotionProvider>{children}</MotionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
