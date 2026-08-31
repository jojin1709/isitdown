import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://isitdown-live.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "Baiduspider",
          "YandexBot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: [
          "Twitterbot",
          "facebookexternalhit",
          "LinkedInBot",
          "Discordbot",
          "Slackbot",
          "TelegramBot",
          "WhatsApp",
        ],
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "CCBot", "ChatGPT-User", "ClaudeBot"],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
