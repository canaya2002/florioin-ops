import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:
    'brand-gradient text-white shadow-[0_18px_40px_-16px_rgba(168,140,255,0.42)] hover:shadow-[0_22px_48px_-14px_rgba(168,140,255,0.55)]',
  secondary:
    'bg-[color:var(--color-glass-strong)] text-[color:var(--color-ink)] border border-[color:var(--color-glass-border)] backdrop-blur-md hover:bg-white',
  ghost:
    'bg-transparent text-[color:var(--color-ink-soft)] hover:bg-[rgba(11,12,16,0.05)]',
  danger: 'bg-[#F0596A] text-white hover:bg-[#d94655]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
