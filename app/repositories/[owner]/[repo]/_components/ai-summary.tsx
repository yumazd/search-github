import { Sparkles } from "lucide-react";
import { generateDetailSummary } from "@/server/ai";

const aiEnabled = process.env.AI_ENABLED === "true";

export async function AiSummary({
  fullName,
  description,
  topics,
}: {
  fullName: string;
  description: string | null;
  topics: string[];
}) {
  const summary = aiEnabled
    ? await generateDetailSummary(fullName, description, topics)
    : null;

  const isAiGenerated = summary && summary !== description;
  const displayText = summary || description || "説明がありません";

  return (
    <div className="rounded-lg border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-4">
      <div className="mb-1.5 flex items-center gap-1.5">
        {isAiGenerated && (
          <Sparkles
            className="h-3.5 w-3.5 text-violet-400"
            aria-hidden="true"
          />
        )}
        <span className="text-xs font-semibold text-violet-300">
          {isAiGenerated ? "AI要約" : "Description"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-gray-300">{displayText}</p>
    </div>
  );
}
