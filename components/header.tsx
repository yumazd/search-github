import Image from "next/image";
import Link from "next/link";
import { MAX_WIDTH_WIDE } from "@/lib/constants";

export function Header() {
  return (
    <header
      className={`w-full px-6 py-3.5 sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl`}
    >
      <div className={MAX_WIDTH_WIDE}>
        <Link href="/">
          <Image
            src="/logo@0.5x.webp"
            alt="Repo Finder"
            width={1294}
            height={243}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
