import type { Metadata, Viewport } from "next";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans-base",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-base",
  subsets: ["latin"],
});

const zenKakuGothic = Zen_Kaku_Gothic_New({
  variable: "--font-jp-base",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "GitHub リポジトリ検索",
    template: "%s | GitHub リポジトリ検索",
  },
  description: "GitHubのリポジトリを探索・発見できるアプリケーション",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${zenKakuGothic.variable} font-sans antialiased min-h-screen bg-[#0a0a0f] text-gray-100`}
      >
        <a
          href="#main"
          className="fixed left-2 z-[100] rounded-lg bg-white px-4 py-2 text-sm font-medium text-black shadow-lg -translate-y-full focus:translate-y-0 focus:top-2 transition-transform"
        >
          メインコンテンツへスキップ
        </a>
        {/* Background gradient */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#0d0b1a] via-[#0a0a0f] to-[#0a0a0f]" />
        <Header />
        <main id="main" className="py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
