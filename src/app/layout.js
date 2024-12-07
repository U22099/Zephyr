import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import icon from "/icons.json";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zephyr",
  description: "Zephyr is a feature-rich chat application built using the Next.js and Firebase.  It offers a comprehensive suite of communication tools, including one-on-one and group chat, video calls, voice calls, status updates, and AI chat interface.  Zephyr is highly customizable, allowing users to personalize their experience.",
  icons: icon.icons,
  themeColor: "#391c1a",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}