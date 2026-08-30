import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IsItDown — Live Server Status & Availability Checker",
  description:
    "Real-time status monitor for Instagram, WhatsApp, Amazon, YouTube, ChatGPT, and custom websites. Live health metrics without logging in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-white font-sans min-h-screen antialiased selection:bg-blue-500/30 selection:text-blue-300">
        {children}
      </body>
    </html>
  );
}
