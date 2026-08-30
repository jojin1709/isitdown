import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "IsItDown — Live Server Status & Availability Checker",
  description:
    "Real-time status monitor for Instagram, WhatsApp, Amazon, YouTube, ChatGPT, and custom websites. Live health metrics without logging in.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "IsItDown",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0E14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-white font-sans min-h-screen antialiased selection:bg-accent/30 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
