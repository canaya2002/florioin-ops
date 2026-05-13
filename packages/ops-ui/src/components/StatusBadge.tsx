import type { ReactNode } from 'react';
import { cn } from '../utils';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

const toneStyles: Record<Tone, string> = {
  neutral:
    'bg-[rgba(11,12,16,0.06)] text-[color:var(--color-ink-soft)] border-[color:var(--color-hairline-strong)]',
  success: 'bg-[rgba(34,195,156,0.12)] text-[#0e7d63] border-[rgba(34,195,156,0.32)]',
  warning: 'bg-[rgba(244,169,60,0.14)] text-[#8a5806] border-[rgba(244,169,60,0.34)]',
  danger: 'bg-[rgba(240,89,106,0.14)] text-[#9a2230] border-[rgba(240,89,106,0.36)]',
  info: 'bg-[rgba(94,160,255,0.14)] text-[#1e508c] border-[rgba(94,160,255,0.36)]',
  brand:
    'brand-gradient-soft text-[color:var(--color-ink-soft)] border-[rgba(168,140,255,0.36)]',
};

interface StatusBadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ tone = 'neutral', children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
