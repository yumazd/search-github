import type { Metadata } from "next";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Zen_Kaku_Gothic_New,
} from "next/font/google";
import { Header } from "@/components/header";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "GitHub リポジトリ検索",
    template: "%s | GitHub リポジトリ検索",
  },
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
        {/* Background gradient */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#0d0b1a] via-[#0a0a0f] to-[#0a0a0f]" />
        <Header />
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
