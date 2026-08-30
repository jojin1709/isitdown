export type ServiceDef = {
  id: string;
  name: string;
  url: string;
  category: "Social" | "Shopping" | "Streaming" | "Dev/AI" | "India" | "Finance";
  icon: string;
  domain: string;
  useFallbackIcon?: boolean;
};

export const SERVICES: ServiceDef[] = [
  // Social
  { id: "instagram", name: "Instagram", url: "https://www.instagram.com", category: "Social", icon: "📸", domain: "instagram.com" },
  { id: "facebook", name: "Facebook", url: "https://www.facebook.com", category: "Social", icon: "👥", domain: "facebook.com" },
  { id: "whatsapp", name: "WhatsApp", url: "https://web.whatsapp.com", category: "Social", icon: "💬", domain: "whatsapp.com" },
  { id: "twitter", name: "X (Twitter)", url: "https://x.com", category: "Social", icon: "🐦", domain: "x.com" },
  { id: "snapchat", name: "Snapchat", url: "https://www.snapchat.com", category: "Social", icon: "👻", domain: "snapchat.com" },
  { id: "discord", name: "Discord", url: "https://discord.com", category: "Social", icon: "🎮", domain: "discord.com" },
  { id: "telegram", name: "Telegram", url: "https://web.telegram.org", category: "Social", icon: "✈️", domain: "telegram.org" },
  { id: "reddit", name: "Reddit", url: "https://www.reddit.com", category: "Social", icon: "🤖", domain: "reddit.com" },
  { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com", category: "Social", icon: "💼", domain: "linkedin.com" },

  // Shopping
  { id: "amazon", name: "Amazon", url: "https://www.amazon.com", category: "Shopping", icon: "📦", domain: "amazon.com" },
  { id: "amazonin", name: "Amazon India", url: "https://www.amazon.in", category: "Shopping", icon: "📦", domain: "amazon.in" },
  { id: "flipkart", name: "Flipkart", url: "https://www.flipkart.com", category: "Shopping", icon: "🛒", domain: "flipkart.com" },
  { id: "myntra", name: "Myntra", url: "https://www.myntra.com", category: "Shopping", icon: "👗", domain: "myntra.com" },
  { id: "ebay", name: "eBay", url: "https://www.ebay.com", category: "Shopping", icon: "🏷️", domain: "ebay.com" },

  // Streaming
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com", category: "Streaming", icon: "▶️", domain: "youtube.com" },
  { id: "netflix", name: "Netflix", url: "https://www.netflix.com", category: "Streaming", icon: "🎬", domain: "netflix.com" },
  { id: "spotify", name: "Spotify", url: "https://open.spotify.com", category: "Streaming", icon: "🎵", domain: "spotify.com" },
  { id: "primevideo", name: "Prime Video", url: "https://www.primevideo.com", category: "Streaming", icon: "📺", domain: "primevideo.com" },
  { id: "hotstar", name: "Disney+ Hotstar", url: "https://www.hotstar.com", category: "Streaming", icon: "⭐", domain: "hotstar.com" },
  { id: "twitch", name: "Twitch", url: "https://www.twitch.tv", category: "Streaming", icon: "🎥", domain: "twitch.tv" },

  // Dev / AI
  { id: "gemini", name: "Google Gemini", url: "https://gemini.google.com", category: "Dev/AI", icon: "✨", domain: "gemini.google.com" },
  { id: "chatgpt", name: "ChatGPT", url: "https://chat.openai.com", category: "Dev/AI", icon: "🤖", domain: "openai.com" },
  { id: "claude", name: "Claude", url: "https://claude.ai", category: "Dev/AI", icon: "✳️", domain: "claude.ai" },
  { id: "github", name: "GitHub", url: "https://github.com", category: "Dev/AI", icon: "🐙", domain: "github.com" },
  { id: "vercel", name: "Vercel", url: "https://vercel.com", category: "Dev/AI", icon: "▲", domain: "vercel.com" },
  { id: "google", name: "Google", url: "https://www.google.com", category: "Dev/AI", icon: "🔍", domain: "google.com" },
  { id: "gmail", name: "Gmail", url: "https://mail.google.com", category: "Dev/AI", icon: "✉️", domain: "mail.google.com" },

  // India
  { id: "jio", name: "Jio", url: "https://www.jio.com", category: "India", icon: "📶", domain: "jio.com" },
  { id: "airtel", name: "Airtel", url: "https://www.airtel.in", category: "India", icon: "📡", domain: "airtel.in" },
  { id: "vi", name: "Vi Vodafone Idea", url: "https://www.myvi.in", category: "India", icon: "📱", domain: "myvi.in" },
  { id: "bsnl", name: "BSNL", url: "https://www.bsnl.co.in", category: "India", icon: "📡", domain: "bsnl.co.in", useFallbackIcon: true },
  { id: "irctc", name: "IRCTC", url: "https://www.irctc.co.in", category: "India", icon: "🚆", domain: "irctc.co.in", useFallbackIcon: true },
  { id: "paytm", name: "Paytm", url: "https://paytm.com", category: "India", icon: "💰", domain: "paytm.com" },
  { id: "phonepe", name: "PhonePe", url: "https://www.phonepe.com", category: "India", icon: "📱", domain: "phonepe.com" },
  { id: "upi", name: "UPI (NPCI)", url: "https://www.npci.org.in", category: "India", icon: "💳", domain: "npci.org.in" },

  // Finance
  { id: "sbi", name: "State Bank of India (SBI)", url: "https://onlinesbi.sbi.bank.in", category: "Finance", icon: "🏦", domain: "sbi.co.in", useFallbackIcon: true },
  { id: "hdfc", name: "HDFC Bank", url: "https://www.hdfcbank.com", category: "Finance", icon: "🏦", domain: "hdfcbank.com" },
  { id: "icici", name: "ICICI Bank", url: "https://www.icicibank.com", category: "Finance", icon: "🏦", domain: "icicibank.com" },
  { id: "axisbank", name: "Axis Bank", url: "https://www.axisbank.com", category: "Finance", icon: "🏦", domain: "axisbank.com" },
  { id: "paypal", name: "PayPal", url: "https://www.paypal.com", category: "Finance", icon: "💳", domain: "paypal.com" },
];
