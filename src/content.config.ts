import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One folder per post: src/content/posts/<slug>/index.md(x), images beside it.
// The slug is the folder name.
const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '*/index.{md,mdx}',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      topics: z.array(z.string()).default([]),
      series: z.string().optional(),
      cover: z
        .object({
          src: image(),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
      layout: z.enum(['technical', 'feature']).default('technical'),
      featured: z.boolean().default(false),
      relatedProjects: z.array(z.string()).default([]),
      relatedPosts: z.array(z.string()).default([]),
    }),
});

export const collections = { posts };
