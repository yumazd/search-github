"use server";

import { z } from "zod/v4";
import { translateReadme } from "@/server/ai";
import { getCommitActivity } from "@/server/github";

const aiEnabled = process.env.AI_ENABLED === "true";

const readmeSchema = z.string().max(50000);

export async function translateReadmeAction(readme: string): Promise<string> {
  const parsed = readmeSchema.safeParse(readme);
  if (!parsed.success) return readme;

  if (!aiEnabled) return parsed.data;
  try {
    return await translateReadme(parsed.data);
  } catch {
    return parsed.data;
  }
}

const repoSummarySchema = z
  .array(
    z.object({
      full_name: z.string().max(200),
      description: z.string().max(1000).nullable(),
      topics: z.array(z.string().max(100)).max(30),
    }),
  )
  .max(30);

export async function summarizeDescriptionsAction(
  repos: { full_name: string; description: string | null; topics: string[] }[],
): Promise<Record<string, string>> {
  const parsed = repoSummarySchema.safeParse(repos);
  if (!parsed.success) return {};

  if (!aiEnabled) return {};
  try {
    const { summarizeDescriptions } = await import("@/server/ai");
    return await summarizeDescriptions(parsed.data);
  } catch {
    return {};
  }
}

const repoIdentifierSchema = z.object({
  owner: z
    .string()
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .max(39),
  repo: z
    .string()
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .max(100),
});

export async function fetchCommitActivityAction(
  owner: string,
  repo: string,
): Promise<number[]> {
  const parsed = repoIdentifierSchema.safeParse({ owner, repo });
  if (!parsed.success) return [];

  return getCommitActivity(parsed.data.owner, parsed.data.repo);
}
