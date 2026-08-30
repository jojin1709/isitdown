export type ServiceDef = {
  id: string;
  name: string;
  url: string;
  category: "Social" | "Shopping" | "Streaming" | "India" | "Dev/AI" | "Finance";
  icon: string;
};

export const SERVICES: ServiceDef[] = [
  // Social
  { id: "instagram", name: "Instagram", url: "https://www.instagram.com", category: "Social", icon: "📸" },
  { id: "facebook", name: "Facebook", url: "https://www.facebook.com", category: "Social", icon: "👥" },
  { id: "whatsapp", name: "WhatsApp", url: "https://web.whatsapp.com", category: "Social", icon: "💬" },
  { id: "twitter", name: "X (Twitter)", url: "https://x.com", category: "Social", icon: "🐦" },
  { id: "snapchat", name: "Snapchat", url: "https://www.snapchat.com", category: "Social", icon: "👻" },
  { id: "discord", name: "Discord", url: "https://discord.com", category: "Social", icon: "🎮" },
  { id: "telegram", name: "Telegram", url: "https://web.telegram.org", category: "Social", icon: "✈️" },
  { id: "reddit", name: "Reddit", url: "https://www.reddit.com", category: "Social", icon: "🤖" },
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com", category: "Social", icon: "💼" },

  // Shopping
  { id: "amazon", name: "Amazon", url: "https://www.amazon.com", category: "Shopping", icon: "📦" },
  { id: "amazonin", name: "Amazon India", url: "https://www.amazon.in", category: "Shopping", icon: "📦" },
  { id: "flipkart", name: "Flipkart", url: "https://www.flipkart.com", category: "Shopping", icon: "🛒" },
  { id: "myntra", name: "Myntra", url: "https://www.myntra.com", category: "Shopping", icon: "👗" },
  { id: "ebay", name: "eBay", url: "https://www.ebay.com", category: "Shopping", icon: "🏷️" },

  // Streaming
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com", category: "Streaming", icon: "▶️" },
  { id: "netflix", name: "Netflix", url: "https://www.netflix.com", category: "Streaming", icon: "🎬" },
  { id: "spotify", name: "Spotify", url: "https://open.spotify.com", category: "Streaming", icon: "🎵" },
  { id: "primevideo", name: "Prime Video", url: "https://www.primevideo.com", category: "Streaming", icon: "📺" },
  { id: "hotstar", name: "Disney+ Hotstar", url: "https://www.hotstar.com", category: "Streaming", icon: "⭐" },
  { id: "twitch", name: "Twitch", url: "https://www.twitch.tv", category: "Streaming", icon: "🎥" },

  // Dev / AI
  { id: "github", name: "GitHub", url: "https://github.com", category: "Dev/AI", icon: "🐙" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com", category: "Dev/AI", icon: "🤖" },
  { id: "claude", name: "Claude", url: "https://claude.ai", category: "Dev/AI", icon: "✳️" },
  { id: "vercel", name: "Vercel", url: "https://vercel.com", category: "Dev/AI", icon: "▲" },
  { id: "google", name: "Google", url: "https://www.google.com", category: "Dev/AI", icon: "🔍" },
  { id: "gmail", name: "Gmail", url: "https://mail.google.com", category: "Dev/AI", icon: "✉️" },

  // India
  { id: "jio", name: "Jio", url: "https://www.jio.com", category: "India", icon: "📶" },
  { id: "airtel", name: "Airtel", url: "https://www.airtel.in", category: "India", icon: "📡" },
  { id: "irctc", name: "IRCTC", url: "https://www.irctc.co.in", category: "India", icon: "🚆" },
  { id: "paytm", name: "Paytm", url: "https://paytm.com", category: "India", icon: "💰" },
  { id: "phonepe", name: "PhonePe", url: "https://www.phonepe.com", category: "India", icon: "📱" },

  // Finance
  { id: "paypal", name: "PayPal", url: "https://www.paypal.com", category: "Finance", icon: "💳" },
];
