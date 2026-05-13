/**
 * Sidebar navigation — single source of truth.
 * Mirrors the route structure under app/(app)/*.
 */

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  iconKey: string;
  badge?: 'actions' | 'insights';
  children?: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/', iconKey: 'overview' },
  {
    label: 'Sales',
    href: '/sales',
    iconKey: 'sales',
    children: [
      { label: 'Pipeline', href: '/sales' },
      { label: 'Hot Leads', href: '/sales/hot' },
      { label: 'At Risk', href: '/sales/at-risk' },
      { label: 'Forecast', href: '/sales/forecast' },
    ],
  },
  {
    label: 'Conversations',
    href: '/conversations',
    iconKey: 'conversations',
    children: [
      { label: 'All', href: '/conversations' },
      { label: 'Email', href: '/conversations/email' },
      { label: 'WhatsApp', href: '/conversations/whatsapp' },
      { label: 'LinkedIn', href: '/conversations/linkedin' },
    ],
  },
  { label: 'Contacts', href: '/contacts', iconKey: 'contacts' },
  { label: 'Actions', href: '/actions', iconKey: 'actions', badge: 'actions' },
  {
    label: 'Content',
    href: '/content',
    iconKey: 'content',
    children: [
      { label: 'This Week', href: '/content' },
      { label: 'Calendar', href: '/content/calendar' },
      { label: 'History', href: '/content/history' },
      { label: 'Performance', href: '/content/performance' },
    ],
  },
  {
    label: 'Marketing',
    href: '/marketing',
    iconKey: 'marketing',
    children: [
      { label: 'Performance', href: '/marketing' },
      { label: 'Posts Published', href: '/marketing/posts' },
    ],
  },
  { label: 'Finance', href: '/finance', iconKey: 'finance' },
  { label: 'Product', href: '/product', iconKey: 'product' },
  { label: 'Insights', href: '/insights', iconKey: 'insights', badge: 'insights' },
  { label: 'Reports', href: '/reports', iconKey: 'reports' },
  { label: 'Settings', href: '/settings', iconKey: 'settings' },
];
