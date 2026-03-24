import { getCommitActivity } from "@/server/github";
import { CommitChartClient } from "./commit-chart-client";

export async function CommitChart({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const data = await getCommitActivity(owner, repo);

  if (data.length > 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
        <CommitChartClient initialData={data} />
      </div>
    );
  }

  // Server failed → let client retry
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
      <CommitChartClient initialData={null} owner={owner} repo={repo} />
    </div>
  );
}
