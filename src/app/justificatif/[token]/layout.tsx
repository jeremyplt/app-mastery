import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ton justificatif de domicile",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
