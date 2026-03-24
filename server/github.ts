import type { SearchResult, Repository } from "@/types/repository";

const GITHUB_API_BASE = "https://api.github.com";

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function searchRepositories(params: {
  q: string;
  sort?: string;
  order?: string;
  page?: number;
  per_page?: number;
}): Promise<SearchResult> {
  const url = new URL(`${GITHUB_API_BASE}/search/repositories`);
  url.searchParams.set("q", params.q);
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.order) url.searchParams.set("order", params.order);
  url.searchParams.set("page", String(params.page || 1));
  url.searchParams.set("per_page", String(params.per_page || 30));

  const res = await fetch(url.toString(), {
    headers: headers(),
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function getRepository(
  owner: string,
  repo: string,
): Promise<Repository> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json();
}

export async function getLanguages(
  owner: string,
  repo: string,
): Promise<Record<string, number>> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
    {
      headers: headers(),
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json();
}

export async function getCommitActivity(
  owner: string,
  repo: string,
): Promise<number[]> {
  for (let i = 0; i < 2; i++) {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/commit_activity`,
      {
        headers: headers(),
        cache: "no-store",
      },
    );
    if (res.status === 202) {
      // GitHub is computing stats, wait and retry
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((week: { total: number }) => week.total);
  }
  return [];
}

export async function getReadme(
  owner: string,
  repo: string,
): Promise<string> {
  const res = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
    {
      headers: {
        ...headers(),
        Accept: "application/vnd.github.raw+json",
      },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) return "";
  return res.text();
}
