"use client";

export default function ResultError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">
        エラーが発生しました
      </h2>
      <p className="text-sm text-gray-400">
        {error.message || "検索中に問題が発生しました。"}
      </p>
      <button
        onClick={reset}
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
      >
        もう一度試す
      </button>
    </div>
  );
}
