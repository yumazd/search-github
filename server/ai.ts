import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export async function translateSearchQuery(query: string): Promise<string> {
  try {
    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `以下の検索クエリを英語に翻訳してください。入力の語数と同じ語数で返してください（1語なら1語、2語なら2語）。意味を膨らませたり類義語を追加しないでください。キーワードのみを返してください。

クエリ: ${query}`,
        },
      ],
    });
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return text.trim();
  } catch {
    return query;
  }
}

export async function summarizeDescriptions(
  repos: { full_name: string; description: string | null; topics: string[] }[],
): Promise<Record<string, string>> {
  if (repos.length === 0) return {};

  try {
    const repoList = repos
      .map(
        (r, i) =>
          `${i + 1}. ${r.full_name}: ${r.description || "No description"} [topics: ${r.topics.join(", ")}]`,
      )
      .join("\n");

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `以下のGitHubリポジトリの説明を、それぞれ日本語で1〜2行に要約してください。
英語の場合は日本語に翻訳＋要約してください。
説明がない場合はリポジトリ名とトピックから推測して概要を生成してください。

各リポジトリごとに以下のJSON形式で返してください（他のテキストは不要）:
{"リポジトリのfull_name": "日本語の要約", ...}

${repoList}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  } catch {
    return {};
  }
}

export async function generateDetailSummary(
  fullName: string,
  description: string | null,
  topics: string[],
): Promise<string> {
  try {
    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `以下のGitHubリポジトリについて、日本語で2〜3行の詳しい概要を生成してください。
リポジトリ: ${fullName}
説明: ${description || "なし"}
トピック: ${topics.join(", ")}

概要のテキストだけを返してください。`,
        },
      ],
    });
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return text.trim();
  } catch {
    return description || "";
  }
}

export async function translateReadme(readme: string): Promise<string> {
  if (!readme) return "";

  try {
    const truncated =
      readme.length > 10000 ? readme.slice(0, 10000) + "\n\n..." : readme;

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `以下のREADME.mdを日本語に翻訳してください。
ルール:
- コードブロック（\`\`\`で囲まれた部分）は翻訳せず、そのまま残す
- インラインコード（\`で囲まれた部分）も翻訳しない
- Markdown構造（見出し、リスト、テーブル等）はそのまま維持する
- 技術用語は適宜カタカナ表記にする
- 自然な日本語にする

${truncated}`,
        },
      ],
    });
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return text.trim();
  } catch {
    return readme;
  }
}
