/**
 * Minimal inline icon set — stroke-based, no external dep.
 * Currents inherit from text color so they pick up sidebar tone.
 */
import type { SVGProps } from 'react';

const baseProps: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function NavIcon({ name }: { name: string }) {
  switch (name) {
    case 'overview':
      return (
        <svg {...baseProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'sales':
      return (
        <svg {...baseProps}>
          <path d="M3 17L9 11l4 4 8-8" />
          <path d="M14 7h7v7" />
        </svg>
      );
    case 'conversations':
      return (
        <svg {...baseProps}>
          <path d="M21 12c0 4.4-4 8-9 8-1 0-2-.15-3-.4L4 21l1.4-4C4.5 15.7 4 13.9 4 12c0-4.4 4-8 9-8s8 3.6 8 8z" />
        </svg>
      );
    case 'contacts':
      return (
        <svg {...baseProps}>
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87" />
          <path d="M17 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case 'actions':
      return (
        <svg {...baseProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'content':
      return (
        <svg {...baseProps}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case 'marketing':
      return (
        <svg {...baseProps}>
          <path d="M3 11l18-8v18l-18-8z" />
          <path d="M11 15v4" />
        </svg>
      );
    case 'finance':
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M9 9h4.5a2.5 2.5 0 010 5H10a2.5 2.5 0 000 5h5" />
        </svg>
      );
    case 'product':
      return (
        <svg {...baseProps}>
          <path d="M12 2l9 4.5v11L12 22 3 17.5v-11L12 2z" />
          <path d="M3 6.5L12 11l9-4.5M12 22V11" />
        </svg>
      );
    case 'insights':
      return (
        <svg {...baseProps}>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.6V17h8v-2.4A7 7 0 0012 2z" />
        </svg>
      );
    case 'reports':
      return (
        <svg {...baseProps}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
