import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "Zephyr";
const APP_DEFAULT_TITLE = "Zephyr: AI Chat, Video Calls, Voice, Groups | Next.js & Firebase App";
const APP_TITLE_TEMPLATE = "%s - Zephyr | AI Communication Platform";
const APP_DESCRIPTION = "Zephyr: Feature-rich AI chat app with video/voice calls, group messaging, status updates. Built on Next.js & Firebase. Customizable, realtime communication. A modern WhatsApp alternative.";
const ICONS = [
  { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
  { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
  { url: "/apple-touch-icon.png", type: "image/png" },
  { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
  { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
  { url: "/favicon.ico", type: "image/x-icon" }
];


export const metadata = {
  applicationName: APP_NAME,
  icons: ICONS,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  keywords: [
    "AI chat",
    "AI assistant",
    "chat application",
    "messaging app",
    "video call",
    "voice call",
    "video chat",
    "voice chat",
    "group chat",
    "group messaging",
    "status updates",
    "realtime chat",
    "instant messaging",
    "communication platform",
    "online chat",
    "Next.js",
    "Firebase",
    "React",
    "JavaScript",
    "Web application",
    "Fullstack",
    "Frontend",
    "Backend",
    "Realtime database",
    "Cloud functions",
    "Authentication",
    "Artificial intelligence chat",
    "AI powered communication",
    "Intelligent assistant",
    "Chatbot",
    "Conversational AI",
    "Natural language processing",
    "Customizable chat",
    "Personalized experience",
    "User friendly chat",
    "Modern chat app",
    "Secure messaging",
    "Private chat",
    "End-to-end encryption",
    "File sharing",
    "Screen sharing",
    "Push notifications",
    "Cross-platform chat",
    "Web chat",
    "Browser chat",
    "Rich communication",
    "WhatsApp alternative",
    "Slack alternative",
    "Discord alternative",
    "Telegram alternative",
    "Microsoft Teams alternative",
    "Google Chat alternative",
    "Personal chat",
    "Social messaging",
    "Team communication",
    "Collaboration tool",
    "Remote work chat",
    "Community chat",
    "Developer chat tool",
    "Tech chat app",
    "Communication",
    "Connect",
    "Social",
    "Network",
    "Digital communication",
    "Online messaging",
    "Internet chat",
    "Web based chat",
    "App",
    "Software",
    "Platform",
    "Tool",
    "Utility",
    "Nextjs Firebase chat example",
    "AI chat interface",
    "Realtime communication app",
    "Video and voice over IP",
    "Group video conferencing",
    "Chat application with status",
    "Modern messaging platform",
    "Firebase powered chat",
    "React chat application",
    "AI for communication",
    "Customizable UI chat",
    "Feature-rich messenger",
    "Zephyr messaging",
    "Zephyr chat app",
    "Zephyr AI",
    "Zephyr communication",
    "Zephyr Nextjs",
    "Zephyr Firebase",
    "PWA chat",
    "Serverless chat",
    "Scalable chat app",
    "Interactive chat",
    "Multimedia messaging"
  ],
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
        >
          {children}
          <Toaster />
          <Sonner position="top-center"/>
        </ThemeProvider>
      </body>
    </html>
  );
}
