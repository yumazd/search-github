import Link from "next/link";
import { GitHubIcon } from "./icons/github-icon";
import { MAX_WIDTH_WIDE } from "@/lib/constants";

export function Header() {
  return (
    <header
      className={`w-full px-6 py-3.5 sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl`}
    >
      <div className={`flex items-center gap-2.5 ${MAX_WIDTH_WIDE}`}>
        <GitHubIcon className="h-7 w-7" />
        <Link href="/" className="text-base font-semibold tracking-tight">
          Repo Finder
        </Link>
      </div>
    </header>
  );
}
