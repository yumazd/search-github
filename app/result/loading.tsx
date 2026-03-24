import { Suspense } from "react";
import { SearchCard } from "@/components/search-card";
import { MAX_WIDTH_WIDE } from "@/lib/constants";

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/30 bg-white/5 p-5 backdrop-blur-3xl animate-pulse">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full bg-white/10" />
        <div className="h-4 w-48 rounded bg-white/10" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-3/4 rounded bg-white/10" />
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-16 rounded bg-white/10" />
        <div className="h-3 w-12 rounded bg-white/10" />
        <div className="h-3 w-12 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function ResultLoading() {
  return (
    <div className={`mx-auto space-y-15 ${MAX_WIDTH_WIDE}`}>
      <div className="lg:grid lg:grid-cols-5 lg:gap-10 space-y-10">
        <div className="lg:col-span-2 space-y-5 lg:sticky lg:top-20 lg:self-start">
          <Suspense>
            <SearchCard />
          </Suspense>
        </div>

        <div className="space-y-3 lg:col-span-3">
          <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
