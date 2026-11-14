import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Drafts show in `astro dev`, and in a build only when SHOW_DRAFTS=1 (local checks).
// The deploy workflow never sets it.
const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

// An estimate: prose at 230 words a minute, code blocks at a third of that.
export function readMinutes(body = ''): number {
  const code = [...body.matchAll(/```[\s\S]*?```/g)].map((m) => m[0]).join(' ');
  const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  const words = (s: string) => (s.match(/\S+/g) ?? []).length;
  return Math.max(1, Math.round(words(prose) / 230 + words(code) / 77));
}

// Dates are calendar days, so format them in UTC to keep the intended day everywhere.
// Written out by hand: en-GB's short month gives "Sept", the design uses "Sep".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
