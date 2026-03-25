"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-100"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      検索結果に戻る
    </button>
  );
}
