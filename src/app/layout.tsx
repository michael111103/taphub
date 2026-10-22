import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TapHub",
  description: "TapHub — software untuk bisnis Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
