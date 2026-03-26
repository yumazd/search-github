import { Suspense } from "react";
import Image from "next/image";
import { MAX_WIDTH_TIGHT } from "@/lib/constants";
import { SearchCard } from "@/components/search-card";
export default function HomePage() {
  return (
    <div className={`mx-auto space-y-15 mt-10 ${MAX_WIDTH_TIGHT}`}>
      {/* Hero */}
      <div className="space-y-5">
        <Image
          src="/logo.webp"
          alt="Repo Finder"
          width={1294}
          height={243}
          className="w-full"
          priority
        />
        <div className="space-y-2 ">
          <p className="text-base text-center font-bold">
            githubからリポジトリを検索。
          </p>
          <p className="text-xs text-center font-bold">
            日本語キーワードもAIが英語に変換して検索してくれます。
          </p>
        </div>
      </div>

      <Suspense>
        <SearchCard />
      </Suspense>
    </div>
  );
}
