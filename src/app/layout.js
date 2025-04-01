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
const APP_KEYWORDS="ai chat, ai assistant, chat application, messaging app, video call, voice call, video chat, voice chat, group chat, group messaging, status updates, realtime chat, instant messaging, communication platform, online chat, next.js, firebase, react, javascript, web application, fullstack, frontend, backend, realtime database, cloud functions, authentication, artificial intelligence chat, ai powered communication, intelligent assistant, daniel, daniel chat app, u22099, developer, chatbot, conversational ai, natural language processing, customizable chat, personalized experience, user friendly chat, modern chat app, secure messaging, private chat, end-to-end encryption, file sharing, screen sharing, push notifications, cross-platform chat, web chat, browser chat, rich communication, whatsapp alternative, slack alternative, discord alternative, telegram alternative, microsoft teams alternative, google chat alternative, personal chat, social messaging, team communication, collaboration tool, remote work chat, community chat, developer chat tool, tech chat app, communication, connect, social, network, digital communication, online messaging, internet chat, web based chat, app, software, platform, tool, utility, nextjs firebase chat example, ai chat interface, realtime communication app, video and voice over ip, group video conferencing, chat application with status, modern messaging platform, firebase powered chat, react chat application, ai for communication, customizable ui chat, feature-rich messenger, zephyr messaging, zephyr chat app, zephyr ai, zephyr communication, zephyr nextjs, zephyr firebase, pwa chat, serverless chat, scalable chat app, interactive chat, multimedia messaging"
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
  keywords: APP_KEYWORDS,
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
