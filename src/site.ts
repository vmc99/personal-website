// Author, navigation and social links: one source for both halves of the site.

export const site = {
  url: 'https://mvamsi.com',
  author: 'Vamsi Mukkamala',
  email: 'hello@mvamsi.com',
  blog: {
    name: 'Terminal Logs',
    description: 'A working log by Vamsi Mukkamala: software engineering, AI agents and whatever he is building this month.',
  },
};

// Each topic keeps one field colour across both halves of the site (DESIGN.md: colour carries meaning).
// A post's `topics` use these slugs; an unknown slug falls back to green and its own slug as label.
export type Field = 'green' | 'blue' | 'amber' | 'plum';
export const topics: Record<string, { label: string; field: Field }> = {
  'ai-engineering': { label: 'AI engineering', field: 'amber' },
  automation: { label: 'Automation', field: 'green' },
  hackathons: { label: 'Hackathons', field: 'blue' },
  tools: { label: 'Tools', field: 'plum' },
  notes: { label: 'Notes', field: 'green' },
};
export const topic = (slug: string) => topics[slug] ?? { label: slug, field: 'green' as Field };

export const social = [
  { label: 'GitHub', href: 'https://github.com/vmc99' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vmc99' },
];

export const portfolioNav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contact', href: '/#contact' },
];

export const blogNav = [
  { label: 'Portfolio', href: '/' },
];
