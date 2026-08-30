export type ServiceDef = {
  id: string;
  name: string;
  url: string;
  category: "Social" | "Shopping" | "Streaming" | "India" | "Dev/AI" | "Finance";
  domain: string;
};

export const SERVICES: ServiceDef[] = [
  // Social
  { id: "instagram", name: "Instagram", url: "https://www.instagram.com", category: "Social", domain: "instagram.com" },
  { id: "facebook", name: "Facebook", url: "https://www.facebook.com", category: "Social", domain: "facebook.com" },
  { id: "whatsapp", name: "WhatsApp", url: "https://web.whatsapp.com", category: "Social", domain: "whatsapp.com" },
  { id: "twitter", name: "X (Twitter)", url: "https://x.com", category: "Social", domain: "x.com" },
  { id: "snapchat", name: "Snapchat", url: "https://www.snapchat.com", category: "Social", domain: "snapchat.com" },
  { id: "discord", name: "Discord", url: "https://discord.com", category: "Social", domain: "discord.com" },
  { id: "telegram", name: "Telegram", url: "https://web.telegram.org", category: "Social", domain: "telegram.org" },
  { id: "reddit", name: "Reddit", url: "https://www.reddit.com", category: "Social", domain: "reddit.com" },
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com", category: "Social", domain: "linkedin.com" },

  // Shopping
  { id: "amazon", name: "Amazon", url: "https://www.amazon.com", category: "Shopping", domain: "amazon.com" },
  { id: "amazonin", name: "Amazon India", url: "https://www.amazon.in", category: "Shopping", domain: "amazon.in" },
  { id: "flipkart", name: "Flipkart", url: "https://www.flipkart.com", category: "Shopping", domain: "flipkart.com" },
  { id: "myntra", name: "Myntra", url: "https://www.myntra.com", category: "Shopping", domain: "myntra.com" },
  { id: "ebay", name: "eBay", url: "https://www.ebay.com", category: "Shopping", domain: "ebay.com" },

  // Streaming
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com", category: "Streaming", domain: "youtube.com" },
  { id: "netflix", name: "Netflix", url: "https://www.netflix.com", category: "Streaming", domain: "netflix.com" },
  { id: "spotify", name: "Spotify", url: "https://open.spotify.com", category: "Streaming", domain: "spotify.com" },
  { id: "primevideo", name: "Prime Video", url: "https://www.primevideo.com", category: "Streaming", domain: "primevideo.com" },
  { id: "hotstar", name: "Disney+ Hotstar", url: "https://www.hotstar.com", category: "Streaming", domain: "hotstar.com" },
  { id: "twitch", name: "Twitch", url: "https://www.twitch.tv", category: "Streaming", domain: "twitch.tv" },

  // Dev / AI
  { id: "github", name: "GitHub", url: "https://github.com", category: "Dev/AI", domain: "github.com" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com", category: "Dev/AI", domain: "openai.com" },
  { id: "claude", name: "Claude", url: "https://claude.ai", category: "Dev/AI", domain: "claude.ai" },
  { id: "vercel", name: "Vercel", url: "https://vercel.com", category: "Dev/AI", domain: "vercel.com" },
  { id: "google", name: "Google", url: "https://www.google.com", category: "Dev/AI", domain: "google.com" },
  { id: "gmail", name: "Gmail", url: "https://mail.google.com", category: "Dev/AI", domain: "mail.google.com" },

  // India
  { id: "jio", name: "Jio", url: "https://www.jio.com", category: "India", domain: "jio.com" },
  { id: "airtel", name: "Airtel", url: "https://www.airtel.in", category: "India", domain: "airtel.in" },
  { id: "irctc", name: "IRCTC", url: "https://www.irctc.co.in", category: "India", domain: "irctc.co.in" },
  { id: "paytm", name: "Paytm", url: "https://paytm.com", category: "India", domain: "paytm.com" },
  { id: "phonepe", name: "PhonePe", url: "https://www.phonepe.com", category: "India", domain: "phonepe.com" },

  // Finance
  { id: "paypal", name: "PayPal", url: "https://www.paypal.com", category: "Finance", domain: "paypal.com" },
];
