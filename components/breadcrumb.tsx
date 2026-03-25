"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  back?: boolean;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const router = useRouter();

  return (
    <nav aria-label="パンくずリスト" className="text-xs text-gray-400">
      <ol className="flex items-center gap-1.5 min-w-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5 min-w-0 shrink-0 last:shrink">
            {i > 0 && (
              <ChevronRight
                className="h-3 w-3 shrink-0"
                aria-hidden="true"
              />
            )}
            {item.back ? (
              <button
                onClick={() => router.back()}
                className="hover:text-gray-200 hover:cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-200 hover:cursor-pointer transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="truncate text-gray-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
