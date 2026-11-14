# Terminal Logs — the blog at mvamsi.com/blog

Revised 14 November 2026. Read [DESIGN.md](DESIGN.md) first: the blog uses the same Logbook tokens, typefaces, header, footer and theme switch as the portfolio, and is part of the same Astro project. This file covers what is specific to the blog. Nothing here is built yet.

## Decisions

- **Name and address.** Terminal Logs, at `https://mvamsi.com/blog/`. Articles at `https://mvamsi.com/blog/<slug>/`, topics at `/blog/topics/<topic>/`, the feed at `/blog/rss.xml`.
- **A subfolder, not a subdomain.** Decided by Vamsi on 14 November 2026, replacing `blog.mvamsi.com`. One build and one deployment on the GitHub Pages site that already exists; the theme choice is shared without a cookie; page transitions run between portfolio and blog; and search engines see one site. The cost is independence: the blog cannot move to another platform without changing its address. Terminal Logs keeps its own name, mark, landing page and feed.
- **Where it lives.** Pages in `src/pages/blog/`, posts in `src/content/posts/<slug>/`, in the same project as the portfolio. Static output.
- **Reading comes first.** Native scrolling, no loading animation, no scroll-triggered reveals, no GSAP or Lenis. The title and first paragraph are on screen immediately.

## What the Anthropic references contribute

| Reference | Take | Leave |
| --- | --- | --- |
| [The components of agent memory](https://www.anthropic.com/research/components-of-agent-memory) | The default article: title, dek, date and topic, narrow column, explanatory diagrams with captions, related reading | Typefaces, palette |
| [The situation report](https://www.anthropic.com/features/ebola-response) | The feature story: a larger opening, section openers, pull quotes, attributed quotations | Photography style, illustration style |
| [Medium reading features](https://help.medium.com/hc/en-us/categories/201798897-Reading) | Read-time estimate, copy link, image zoom, topics | Claps, public highlights, feeds, member features |

The earlier draft noted these pages were read as text only, without a rendered comparison. That is still true; Logbook was designed from their structure, not measured from their pixels.

## Three layouts

**Index.** The Terminal Logs title with one line of description under it. The activity map: one cell per day for the last 26 weeks, with a dark cell for each published post, built at build time from post dates and nothing else. One featured post as a colour field. Topic chips. Then the log: one row per post with date, title, one-sentence summary and read time. Search opens with `/`. With fewer than five posts, show the rows only and hide the chips.

**Technical article.** Topic, date, read time. Title. Dek. Then the 42rem column, with a 58rem breakout for code, figures and tables. A table of contents in the left margin from 1120px, collapsible above the article on smaller screens. Stable heading links, footnotes with return links, captioned figures, code blocks with a file name or terminal frame and a copy button. Ends with a two-line author note, the linked project if there is one, and up to three related posts.

**Feature story.** The same metadata and components, plus a full-width opening (artwork or a generated cell-grid cover), section openers and pull quotes. Selected per post with `layout: feature`. No separate content system.

A post without artwork gets a generated cover: its topic's field colour and a cell pattern derived from its slug. Do not force a stock image onto short notes.

## Features

| When | Feature |
| --- | --- |
| Launch | Read-time estimate (labelled as an estimate), topics, related posts, copy link, table of contents, heading links, code copy, footnotes, captions, image zoom, search (Pagefind), RSS, sitemap, generated social images, activity map, series navigation |
| After launch, if wanted | Comments through Giscus; "copy link to this passage" using text fragments; email subscription once a provider and a cadence exist; a device-local reading list |
| Not planned | Audio, claps, public highlights, personalised feeds, accounts |

Scheduled publishing is dropped. A post is either `draft: true` or published by merging it. That removes the need for timed rebuilds.

## Content model

Fields: `title`, `description`, `publishedAt`, optional `updatedAt`, `draft`, `topics`, optional `series`, optional `cover` with `alt` and `caption`, `layout` (`technical` by default, or `feature`), optional `featured`, optional `relatedProjects`, optional `relatedPosts`. The slug is the folder name. Read time and the table of contents are derived from the body.

Workflow: create `src/content/posts/<slug>/index.md`, add images beside it, preview locally, merge. Drafts are excluded from pages, search, RSS, the sitemap, related lists and the portfolio's Writing section. The repository is public, so a pushed draft can still be read on GitHub; keep unfinished posts on an unpushed branch if that matters.

## The existing Hugo folder

Found at `../blog-terminal-logs/` (Hugo 0.147, PaperMod). Checked on 13 November 2026:

- It is not a git repository and was never deployed. `blog.mvamsi.com` has no DNS record, the `baseURL` is a localhost path, and the Giscus IDs are placeholders. So there are no legacy URLs to redirect, no discussions to preserve, and no shortcodes in use that need converting. Its `DEPLOYMENT.md` is superseded by this plan.
- Most of `content/` is the PaperMod sample corpus (demo posts, French and Farsi test files). None of it is Vamsi's writing. Leave it behind.
- Three posts carry Vamsi's name. "Welcome to Terminal Logs" is worth rewriting shorter as the first entry, keeping its 22 September 2025 date. "Setting Up a Modern Development Environment" still contains template text ("Your Name", `your.email@example.com`) and reads as generic; keep it as a draft until it is rewritten around his actual setup. "Test Log" is a test; drop it.
- Worth carrying forward, because Vamsi built them: the activity heatmap with a featured post beside it (now the cell-grid motif for the whole system), the `featured` flag, the `series` and `post_number` fields, and the full-width cover treatment on wide screens.
- Its social links (`vamsimukkamala` on GitHub, LinkedIn and X) differ from the portfolio's (`vmc99`, `vamsi_mukkamala`). The git remote confirms `vmc99` for GitHub. Use one list in `src/site.ts` once Vamsi confirms it.

Keep the Hugo folder untouched as the source for those two posts and the heatmap logic.

## Launch content

The design will make thin posts look thinner. Launch with at least two real posts drawn from work Vamsi can describe first-hand. Candidates, to be confirmed by him:

- How the Anti-Pattern Resolutor decides whether to keep a model's edit (technical article).
- Building Chameleon at the Hacking Agents hackathon (feature story).
- The Zoom bot his cohort used (shorter note).

## Links between portfolio and blog

- "Blog" in the header points to `/blog/`. On blog pages the header brand is Terminal Logs with the prompt mark and points to `/blog/`; "Portfolio" in the blog's navigation points to `/`.
- `mvamsi.com/terminal-logs.html` forwards to `/blog/` through a static page with a meta refresh and a canonical link, because GitHub Pages has no server redirects.
- A case study links to the posts about it and each post links back to its project, through `relatedProjects`.
- Author details, navigation and social links come from one file, so the two halves cannot drift.
- One sitemap and one robots file for the whole site. Every page emits its own canonical URL. The feed lists blog posts only.
- Search: each article has its own title ending in "Terminal Logs", description, social image and `BlogPosting` structured data, so it is indexed and shared as an article in its own right.

## First design deliverable

Build the index and one technical article with a real draft post, real code and one real diagram, in both themes at 390 and 1440px, next to the portfolio hero. Judge the reading experience there before building anything else.
