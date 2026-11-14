# AGENTS.md

Vamsi Mukkamala's site: the portfolio at `mvamsi.com` and the blog, Terminal Logs, at `mvamsi.com/blog/`. One Astro 7 project, static output, deployed to GitHub Pages by GitHub Actions. The repository is public.

## Read first

- `.agents/portfolio-v2/DESIGN.md` is the source of truth for the design, the stack and every decision. Follow it; do not redesign. If a change needs a decision it does not cover, ask Vamsi.
- `.agents/portfolio-v2/BLOG.md` for blog layouts and the content model; `MIGRATION.md` for build phases and the release checklist; `QA.md` for what to verify.

## Commands

Node 24 (`.nvmrc`; Astro needs 22.23+).

| Command | Does |
| --- | --- |
| `npm ci` | Install exactly what the lockfile says. |
| `npm run dev` | Dev server at `localhost:4321`. Shows drafts. |
| `npm run check` | Astro type and content checks. Must pass with 0 errors and 0 warnings. |
| `npm run build` | Production build to `dist/`, then the Pagefind index. Drafts excluded. |
| `SHOW_DRAFTS=1 npm run build` | Build including drafts, for local checks only. Rebuild without it afterwards. |
| `npm run preview` | Serve `dist/` to review a production build. GitHub Pages has no preview deployments. |

After changing Markdown or Expressive Code configuration, delete `node_modules/.astro` and `.astro/data-store.json` before building. Astro caches rendered Markdown, and a stale cache links code-block CSS that no longer exists.

## Where things live

```text
src/pages/                  portfolio: /, /work/<slug>/, /privacy-policy/, 404
src/pages/blog/             blog: /blog/, /blog/<slug>/, /blog/topics/<topic>/, /blog/rss.xml
src/content/posts/<slug>/   index.md or index.mdx, images beside it. Slug = folder name.
src/content.config.ts       post schema
src/components/, src/layouts/
src/styles/tokens.css       every colour, size, space and radius
src/site.ts                 author, email, navigation, social links (one list for both halves)
public/                     served as-is: CNAME, favicons, static/resume.pdf, terminal-logs.html
.github/workflows/deploy.yml
.agents/                    plan, design previews, skills
```

## Rules

- **Tokens only.** Colours, type sizes, spacing and the radius come from `src/styles/tokens.css`. No hard-coded colour in a component. New tokens go in that file, in both themes, with contrast re-measured (4.5:1 or better).
- **Design guardrails from DESIGN.md:** monospace only for code; no tracked-uppercase eyebrows, numbered labels, status dots or emoji icons; no shadows or outlined cards; hairlines only between list rows and above footnotes; one 4px radius.
- **Content must be complete with JavaScript off.** Honour `prefers-reduced-motion`. GSAP on the portfolio only; the blog ships no animation library.
- **No cookies.** Theme lives in `localStorage` under `theme`. No analytics or embed that sets cookies.
- **Unconfirmed copy** is wrapped in `<Placeholder note="…">`. The deploy fails on `main` while any remains. Never invent facts, dates, metrics or screenshots about Vamsi's work.
- **Keep these addresses working:** `/`, `/privacy-policy/`, `/static/resume.pdf`, `/terminal-logs.html` (forwards to `/blog/`), `/sitemap.xml`, `/robots.txt`.
- **Do not touch** `public/CNAME`, the DNS or mail set-up, or the repository's Pages settings.
- **Do not commit, push, merge into `main` or release** unless Vamsi asks. `main` serves the live site.
- **Drafts are public once pushed.** `draft: true` keeps a post off the site, not off GitHub.
- Pin exact dependency versions. Check the installed package's own docs before relying on memory: Astro 7 replaced the remark/rehype Markdown pipeline with Sätteri.

## Skills

In `.agents/skills/`:

- `design-taste-frontend`: concept and build passes, and `scripts/lint.mjs` against generated-looking design. DESIGN.md overrides its "draw a direction" step.
- `web-design-guidelines`: accessibility and interaction review of implemented source.
- `playwright-cli`: drive a real browser to verify pages. Pinned CLI in `.agents/portfolio-v2/tooling/`.

## Verifying a change

1. `npm run check` and `npm run build` pass.
2. `npm run preview`, then look at every page you touched at 320, 390, 768 and 1440px, in Light and Dark: no horizontal scroll, no overlap, nothing sticky covering content.
3. Keyboard through it: visible focus, sensible order.
4. No console errors.
5. Say what you checked and what you did not. Update the "verified so far" paragraph in `QA.md` when it changes.
