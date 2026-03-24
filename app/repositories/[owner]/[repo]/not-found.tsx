import Link from "next/link";

export default function DetailNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-100">
        リポジトリが見つかりません
      </h2>
      <p className="text-sm text-gray-400">
        指定されたリポジトリは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10"
      >
        検索に戻る
      </Link>
    </div>
  );
}
