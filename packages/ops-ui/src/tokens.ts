/**
 * Florioin Liquid Glass — design tokens.
 *
 * Replicated from the FlorioIn product. Visual identity rules:
 *   - Background: luminous cream (#FAFBFC)
 *   - Shell: obsidian dark (sidebar / topbar)
 *   - Cards: glass white translucent rgba(255,255,255,0.62)
 *     with multi-shadow blue-tinted
 *   - Brand gradient: rose → violet → cyan
 *     (#FF8DDA → #A88CFF → #38E4FF)
 *   - Typography: Inter
 */

export const colors = {
  // Base canvas
  cream: '#FAFBFC',
  creamSoft: '#F4F6F9',

  // Obsidian shell
  obsidian: '#0B0C10',
  obsidianElevated: '#15171E',
  obsidianBorder: 'rgba(255,255,255,0.06)',
  obsidianText: '#EAEBEE',
  obsidianMuted: '#7A7E89',

  // Glass surface
  glass: 'rgba(255,255,255,0.62)',
  glassStrong: 'rgba(255,255,255,0.78)',
  glassBorder: 'rgba(255,255,255,0.78)',
  glassHighlight: 'rgba(255,255,255,0.95)',

  // Ink (text on cream)
  ink: '#0B0C10',
  inkSoft: '#2A2D36',
  inkMuted: '#6B6F7A',
  inkSubtle: '#9AA0AB',

  // Brand gradient stops
  brandRose: '#FF8DDA',
  brandViolet: '#A88CFF',
  brandCyan: '#38E4FF',

  // Semantic
  success: '#22C39C',
  warning: '#F4A93C',
  danger: '#F0596A',
  info: '#5EA0FF',

  // Hairlines on cream
  hairline: 'rgba(11,12,16,0.06)',
  hairlineStrong: 'rgba(11,12,16,0.12)',
} as const;

export const gradients = {
  brand: 'linear-gradient(135deg, #FF8DDA 0%, #A88CFF 50%, #38E4FF 100%)',
  brandSoft:
    'linear-gradient(135deg, rgba(255,141,218,0.16) 0%, rgba(168,140,255,0.16) 50%, rgba(56,228,255,0.16) 100%)',
  obsidian: 'linear-gradient(180deg, #0B0C10 0%, #15171E 100%)',
} as const;

export const shadows = {
  glass:
    '0 1px 0 0 rgba(255,255,255,0.9) inset, 0 14px 30px -12px rgba(80,110,180,0.18), 0 4px 10px -6px rgba(80,110,180,0.10)',
  glassHover:
    '0 1px 0 0 rgba(255,255,255,0.95) inset, 0 22px 44px -14px rgba(80,110,180,0.24), 0 6px 14px -8px rgba(80,110,180,0.14)',
  obsidian: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -18px rgba(0,0,0,0.55)',
  brandGlow: '0 18px 40px -16px rgba(168,140,255,0.42)',
} as const;

export const radii = {
  xs: '6px',
  sm: '10px',
  md: '14px',
  lg: '18px',
  xl: '22px',
  '2xl': '28px',
  pill: '999px',
} as const;

export const typography = {
  fontSans: 'var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const motion = {
  springSnap: 'cubic-bezier(0.22, 1, 0.36, 1)',
  springSoft: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type Tokens = {
  colors: typeof colors;
  gradients: typeof gradients;
  shadows: typeof shadows;
  radii: typeof radii;
  typography: typeof typography;
  motion: typeof motion;
};

export const tokens: Tokens = {
  colors,
  gradients,
  shadows,
  radii,
  typography,
  motion,
};
