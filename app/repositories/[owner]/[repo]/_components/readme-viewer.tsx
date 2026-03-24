import { getReadme } from "@/server/github";
import { ReadmeContent } from "./readme-content";

export async function ReadmeViewer({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const rawReadme = await getReadme(owner, repo);

  if (!rawReadme) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="border-b border-white/10 bg-white/5 px-6 py-3">
          <h3 className="text-sm font-medium text-gray-300">README.md</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-500">READMEがありません</p>
        </div>
      </div>
    );
  }

  return <ReadmeContent rawReadme={rawReadme} />;
}
