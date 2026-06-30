import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MathUz Admin",
  description: "MathUz Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="h-full">
      <body className="h-full" style={{ background: "#f9f9fb" }}>{children}</body>
    </html>
  );
}
