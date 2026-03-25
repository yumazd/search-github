import { MAX_WIDTH_TIGHT } from "@/lib/constants";
import { Breadcrumb } from "@/components/breadcrumb";
import { BackButton } from "./_components/back-button";

export default function DetailLoading() {
  return (
    <div className={`mx-auto space-y-8 ${MAX_WIDTH_TIGHT}`}>
      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: "検索結果", back: true },
          { label: "..." },
        ]}
      />
      <BackButton />
      <div className="animate-pulse space-y-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-white/10" />
              <div className="h-3 w-32 rounded bg-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/10" />
            <div className="h-4 w-3/4 rounded bg-white/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 rounded-full bg-white/10" />
            <div className="h-8 w-16 rounded-full bg-white/10" />
            <div className="h-8 w-16 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-32 rounded-xl border border-white/10 bg-white/5" />
          <div className="h-32 rounded-xl border border-white/10 bg-white/5" />
        </div>

        <div className="h-96 rounded-xl border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}
