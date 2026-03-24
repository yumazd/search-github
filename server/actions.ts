"use server";

import { translateReadme } from "@/server/ai";
import { getCommitActivity } from "@/server/github";

const aiEnabled = process.env.AI_ENABLED === "true";

export async function translateReadmeAction(
  readme: string,
): Promise<string> {
  if (!aiEnabled) return readme;
  try {
    return await translateReadme(readme);
  } catch {
    return readme;
  }
}

export async function summarizeDescriptionsAction(
  repos: { full_name: string; description: string | null; topics: string[] }[],
): Promise<Record<string, string>> {
  if (!aiEnabled) return {};
  try {
    const { summarizeDescriptions } = await import("@/server/ai");
    return await summarizeDescriptions(repos);
  } catch {
    return {};
  }
}

export async function fetchCommitActivityAction(
  owner: string,
  repo: string,
): Promise<number[]> {
  return getCommitActivity(owner, repo);
}
