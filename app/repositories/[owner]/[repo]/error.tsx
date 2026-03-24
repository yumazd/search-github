"use client";

import Link from "next/link";

export default function DetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">
        リポジトリの取得に失敗しました
      </h2>
      <p className="text-sm text-gray-400">
        GitHubに接続できないか、一時的なエラーが発生しています。
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
        >
          検索に戻る
        </Link>
      </div>
    </div>
  );
}
