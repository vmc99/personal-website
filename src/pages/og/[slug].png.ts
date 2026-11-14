// Social images at /og/<slug>.png: one per post, plus `home` (portfolio) and `blog` (blog landing).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getPosts, formatDate } from '../../lib/posts';
import { renderOg } from '../../lib/og';
import { site, topic, type Field } from '../../site';

type Props = { title: string; kicker: string; brand: 'blog' | 'portfolio'; field: Field };

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return [
    { params: { slug: 'home' }, props: { title: 'I design, build and automate things.', kicker: 'Software engineer · mvamsi.com', brand: 'portfolio' as const, field: 'green' as const } },
    { params: { slug: 'blog' }, props: { title: site.blog.name, kicker: 'A working log by Vamsi Mukkamala · mvamsi.com/blog', brand: 'blog' as const, field: 'green' as const } },
    ...posts.map((p) => {
      const t = topic(p.data.topics[0] ?? '');
      return {
        params: { slug: p.id },
        props: { title: p.data.title, kicker: `${t.label} · ${formatDate(p.data.publishedAt)}`, brand: 'blog' as const, field: t.field },
      };
    }),
  ] satisfies { params: { slug: string }; props: Props }[];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props }) => {
  const png = await renderOg({ ...(props as Props), slug: params.slug! });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
