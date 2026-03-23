export interface RepositoryOwner {
  login: string;
  avatar_url: string;
}

export interface RepositoryLicense {
  spdx_id: string;
}

export interface Repository {
  id: number;
  full_name: string;
  name: string;
  owner: RepositoryOwner;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license: RepositoryLicense | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  html_url: string;
  homepage: string | null;
}

export interface RepositoryDetail extends Repository {
  languages: Record<string, number>;
  commitActivity: number[];
  readme: string;
  aiSummary: string;
}

export interface SearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}
