import type { Metadata } from "next";
import "./creative3d.css";

export const metadata: Metadata = {
  title: "ChicoCode — Creative Developer Portfolio",
  description: "Interactive 3D portfolio — code, AI, hardware.",
};

export default function Creative3dLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="c3d-body">{children}</body>
    </html>
  );
}
