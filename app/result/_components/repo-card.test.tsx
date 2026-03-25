import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RepoCard } from "@/app/result/_components/repo-card";
import type { Repository } from "@/types/repository";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock AiDescription (depends on server actions)
vi.mock("@/app/result/_components/ai-description", () => ({
  AiDescription: () => null,
}));

const baseRepo: Repository = {
  id: 1,
  full_name: "facebook/react",
  name: "react",
  owner: { login: "facebook", avatar_url: "https://example.com/avatar.png" },
  description: "A declarative UI library",
  language: "JavaScript",
  stargazers_count: 230000,
  forks_count: 47000,
  watchers_count: 6700,
  open_issues_count: 900,
  license: { spdx_id: "MIT" },
  topics: ["react", "javascript", "ui"],
  updated_at: new Date().toISOString(),
  created_at: "2013-05-24T00:00:00Z",
  html_url: "https://github.com/facebook/react",
  homepage: "https://react.dev",
};

describe("RepoCard", () => {
  // ── 正常系 ──

  it("リポジトリ名が表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("facebook/react")).toBeInTheDocument();
  });

  it("Star数がフォーマットされて表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("230.0k")).toBeInTheDocument();
  });

  it("description が表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("A declarative UI library")).toBeInTheDocument();
  });

  it("言語が表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
  });

  it("ライセンスが表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("トピックが表示される", () => {
    render(<RepoCard repo={baseRepo} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });

  it("リンク先が /repositories/{full_name} になっている", () => {
    render(<RepoCard repo={baseRepo} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/repositories/facebook/react");
  });

  // ── 異常系 ──

  it("description が null の場合、description 行が描画されない", () => {
    render(<RepoCard repo={{ ...baseRepo, description: null }} />);
    expect(
      screen.queryByText("A declarative UI library"),
    ).not.toBeInTheDocument();
  });

  it("language が null の場合、言語表示が出ない", () => {
    render(<RepoCard repo={{ ...baseRepo, language: null }} />);
    expect(screen.queryByText("JavaScript")).not.toBeInTheDocument();
  });

  it("license が null の場合、ライセンスバッジが出ない", () => {
    render(<RepoCard repo={{ ...baseRepo, license: null }} />);
    expect(screen.queryByText("MIT")).not.toBeInTheDocument();
  });

  it("topics が空配列の場合、トピックセクションが出ない", () => {
    render(<RepoCard repo={{ ...baseRepo, topics: [] }} />);
    expect(screen.queryByText("react")).not.toBeInTheDocument();
  });
});
