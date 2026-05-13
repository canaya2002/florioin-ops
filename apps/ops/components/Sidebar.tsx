'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@florioin-ops/ops-ui';
import { NAV_ITEMS, type NavItem } from './nav-config';
import { NavIcon } from './NavIcon';

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === '/') return pathname === '/';
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="obsidian-shell flex h-screen w-[252px] flex-col border-r">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-[color:var(--color-obsidian-border)] px-5">
        <div className="brand-gradient h-8 w-8 rounded-xl shadow-[0_8px_18px_-8px_rgba(168,140,255,0.6)]" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[color:var(--color-obsidian-text)]">
            Florioin Ops
          </span>
          <span className="text-[11px] text-[color:var(--color-obsidian-muted)]">
            Founder Hub
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-[rgba(255,255,255,0.08)] text-[color:var(--color-obsidian-text)]'
                      : 'text-[color:var(--color-obsidian-muted)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[color:var(--color-obsidian-text)]',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center',
                      active && 'text-white',
                    )}
                  >
                    <NavIcon name={item.iconKey} />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge === 'actions' && (
                    <span className="brand-gradient inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold text-white">
                      0
                    </span>
                  )}
                </Link>
                {active && item.children && (
                  <ul className="mt-1 ml-9 space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block rounded-lg px-2 py-1 text-[12.5px] transition-colors',
                              childActive
                                ? 'text-[color:var(--color-obsidian-text)]'
                                : 'text-[color:var(--color-obsidian-muted)] hover:text-[color:var(--color-obsidian-text)]',
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[color:var(--color-obsidian-border)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white">
            CA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[color:var(--color-obsidian-text)]">
              Carlos Anaya
            </p>
            <p className="truncate text-[10px] text-[color:var(--color-obsidian-muted)]">
              carlos@florioin.app
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
