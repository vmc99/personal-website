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

// Case studies, one file per project. Only public facts go in here; anything Vamsi has not
// confirmed yet (personal contribution, metrics, screenshots) is left empty, and the case study
// page shows a placeholder for it that blocks release.
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    field: z.enum(['green', 'blue', 'amber', 'plum']),
    context: z.string(),
    year: z.number(),
    stack: z.array(z.string()),
    repo: z.url(),
    award: z.object({ label: z.string(), url: z.url() }).optional(),
    selected: z.boolean().default(false),
    order: z.number().default(99),
    contribution: z.string().optional(),
  }),
});

export const collections = { posts, projects };
