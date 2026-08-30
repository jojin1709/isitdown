"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "oled" | "navy" | "cyberpunk";

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "oled", label: "OLED Black", icon: "⬛" },
  { id: "navy", label: "Midnight Navy", icon: "🌌" },
  { id: "cyberpunk", label: "Cyberpunk", icon: "🤖" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("isitdown_theme") as Theme) || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function changeTheme(newTheme: Theme) {
    setTheme(newTheme);
    localStorage.setItem("isitdown_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  return (
    <div className="flex items-center gap-1.5 bg-card border border-line p-1 rounded-full text-xs">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => changeTheme(t.id)}
          className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 font-semibold ${
            theme === t.id
              ? "bg-accent text-white shadow-md shadow-accent/20"
              : "text-white/40 hover:text-white"
          }`}
          title={`Switch to ${t.label} theme`}
        >
          <span>{t.icon}</span>
          <span className="hidden md:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
