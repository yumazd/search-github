import { NextRequest, NextResponse } from "next/server";
import {
  generateDetailSummary,
  translateReadme,
} from "@/server/ai";

export async function POST(request: NextRequest) {
  const aiEnabled = process.env.AI_ENABLED !== "false";

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "summary") {
      const { fullName, description, topics } = body;
      const summary = aiEnabled
        ? await generateDetailSummary(fullName, description, topics || [])
        : description || "";
      return NextResponse.json({ summary });
    }

    if (action === "readme") {
      const { readme } = body;
      const translated = aiEnabled ? await translateReadme(readme) : readme;
      return NextResponse.json({ translated });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "AI処理中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
