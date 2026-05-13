import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong';
  padded?: boolean;
  children: ReactNode;
}

export function GlassCard({
  variant = 'default',
  padded = true,
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === 'strong' ? 'glass-card-strong' : 'glass-card',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
