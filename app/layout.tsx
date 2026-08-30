import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IsItDown — check if Amazon, Instagram, WhatsApp or anything else is down",
  description:
    "Live status checker for popular apps and websites. No login. Check any custom URL too.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-white font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
