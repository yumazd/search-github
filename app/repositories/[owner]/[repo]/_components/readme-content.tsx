"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Languages } from "lucide-react";
import { translateReadmeAction } from "@/server/actions";

export function ReadmeContent({ rawReadme }: { rawReadme: string }) {
  const [translated, setTranslated] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const result = await translateReadmeAction(rawReadme);
      setTranslated(result);
    } catch {
      // Keep raw README on failure
    } finally {
      setTranslating(false);
    }
  };

  const content = showOriginal || !translated ? rawReadme : translated;

  const button =
    !translated && !translating ? (
      <button
        onClick={handleTranslate}
        className="flex items-center gap-1.5 text-sm font-bold text-black hover:opacity-80 bg-white rounded-2xl py-1 px-2 transition-colors shadow-lg hover:cursor-pointer"
      >
        <Languages className="h-3.5 w-3.5" />
        AI翻訳する
      </button>
    ) : translating ? (
      <span className="text-xs text-gray-200 animate-pulse">翻訳中...</span>
    ) : translated ? (
      <button
        onClick={() => setShowOriginal((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm font-bold text-black hover:opacity-80 bg-white rounded-2xl py-1 px-2 transition-colors shadow-lg hover:cursor-pointer"
      >
        <Languages className="h-3.5 w-3.5" />
        {showOriginal ? "翻訳を表示" : "原文を表示"}
      </button>
    ) : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl px-6 py-3 rounded-t-xl sticky top-14 z-10">
        <h3 className="text-sm font-medium text-gray-300">README.md</h3>
        {button}
      </div>
      <div className="px-6 py-5">
        <div className="prose prose-invert prose-sm max-w-none prose-headings:border-b prose-headings:border-white/10 prose-headings:pb-2 prose-a:text-violet-400 prose-code:text-emerald-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
