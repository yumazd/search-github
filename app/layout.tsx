import type { Metadata } from "next";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { Github } from "lucide-react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const zenKakuGothic = Zen_Kaku_Gothic_New({
  variable: "--font-jp",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub リポジトリ検索",
  description: "GitHubのリポジトリを探索・発見できるアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${zenKakuGothic.variable} antialiased min-h-screen bg-[#0a0a0f] text-gray-100`}
      >
        {/* Neon glow background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute top-40 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px]" />
          <div className="absolute top-[55%] -left-20 h-[350px] w-[350px] rounded-full bg-fuchsia-500/15 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center gap-2.5 px-6 py-3.5">
            <Github className="h-5 w-5" />
            <a href="/" className="text-base font-semibold tracking-tight">
              Repo Finder
            </a>
          </div>
        </header>
        <main className="mx-auto max-w-[95%] px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
