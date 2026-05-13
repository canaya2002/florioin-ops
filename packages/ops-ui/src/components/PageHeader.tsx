import type { ReactNode } from 'react';
import { cn } from '../utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex items-start justify-between gap-6 pb-6', className)}>
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-[color:var(--color-ink-muted)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
