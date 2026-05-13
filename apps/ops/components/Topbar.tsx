'use client';

import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from './nav-config';

function pageTitle(pathname: string): string {
  for (const item of NAV_ITEMS) {
    if (item.href === pathname || pathname.startsWith(`${item.href}/`)) {
      if (item.children) {
        const child = item.children.find((c) => c.href === pathname);
        if (child) return `${item.label} · ${child.label}`;
      }
      return item.label;
    }
  }
  return 'Florioin Ops';
}

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[color:var(--color-hairline)] bg-[rgba(250,251,252,0.8)] px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-medium text-[color:var(--color-ink-muted)]">{title}</h2>
      </div>
      <div className="flex items-center gap-3 text-xs text-[color:var(--color-ink-muted)]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-hairline-strong)] bg-white/70 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F4A93C]" />
          Mock mode
        </span>
      </div>
    </header>
  );
}
