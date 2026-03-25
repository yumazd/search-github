import { Suspense } from "react";
import { MAX_WIDTH_TIGHT } from "@/lib/constants";
import { SearchCard } from "@/components/search-card";
export default function HomePage() {
  return (
    <div className={`mx-auto space-y-15 ${MAX_WIDTH_TIGHT}`}>
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight font-display">
          リポジトリを探す
        </h1>
        <p className="text-sm font-bold">
          日本語キーワードもAIが英語に変換して検索してくれます。
        </p>
      </div>

      <Suspense>
        <SearchCard />
      </Suspense>
    </div>
  );
}
