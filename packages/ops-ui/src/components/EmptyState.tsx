import type { ReactNode } from 'react';
import { cn } from '../utils';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-center',
        className,
      )}
    >
      {icon && (
        <div className="brand-gradient-soft flex h-14 w-14 items-center justify-center rounded-2xl">
          <div className="text-[color:var(--color-ink-soft)]">{icon}</div>
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-[color:var(--color-ink)]">{title}</h3>
        {description && (
          <p className="max-w-md text-sm text-[color:var(--color-ink-muted)]">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
