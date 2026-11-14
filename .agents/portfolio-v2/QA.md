# V2 verification plan

Revised 14 November 2026. Run these against a production build, not the dev server.

## What has been verified so far

Only the design previews. The two exploration pages, `preview/portfolio-home.html` and `preview/blog-home.html`, as of 14 November 2026 with the owl hero and the footer twinkle: rendered in Chrome at 320, 390, 768, 1024 and 1440px with no horizontal overflow and no console errors, in light and dark; the owl seen looking at a simulated pointer, smiling when it came close, flapping after a click, asleep with its Z's, and centred on phone widths; the footer twinkle seen on both pages in both themes; the header captured condensed. From 13 November, before the owl: the header transition was sampled frame by frame (0.64s, constant header height) and captured mid-way, and the header-logo blink was detected by script. Not exercised: the click ripple frame by frame, click-to-replay, and interrupting the header transition half-way. Nothing was watched by a person at real frame rate, and nothing was tested under reduced motion, on a touch device, or in Safari or Firefox. And `preview/design-system.html`: rendered in Chrome through the pinned Playwright CLI, light and dark, at 320, 390, 768 and 1440px; no horizontal overflow at any of those widths; all three web fonts loaded; every text and background pairing it uses measured at 4.5:1 or better. It is a static mock with sample copy. The V2 spike (14 November 2026, production build, Chrome via the pinned CLI): home, blog index and one article at 390 and 1440px with no horizontal overflow and no console errors; Newsreader and Hanken Grotesk loaded; a stored Dark choice applied on load and carried from portfolio to blog; the switch cycled Auto → Light → Dark and Auto cleared storage; a portfolio → blog click ran as a view transition; code blocks on `--sunken` with no shadow in both themes (drafts build); drafts absent from pages, feed and sitemap; Pagefind indexed the article only; `/terminal-logs.html`, `/sitemap.xml`, `/static/resume.pdf` answer 200 and an unknown path 404. Foundation, same day: the header condenses at 16px with no height change (65px both states), the name wipes fully, the owl's eyes follow the pointer once condensed, the blink fired within seven seconds of pointer movement; the footer twinkle runs; the theme switch runs as a view transition; the blog prompt turns on the first blog page of the session and not on the second; both font preloads match the files the CSS uses; no overflow at 390 or 1440px. Blog and portfolio, same night: blog landing with lead story, generated cover and activity-map preview card (exercised with a temporary dated post, since deleted); search opened with `/`, results, empty state, Escape closes; article contents in the margin at 1440px and collapsed at 390px, heading anchors, footnotes, copy link, related posts (temporary post); portfolio home, two case studies and the privacy policy at 390 and 1440px with no overflow; home → case study ran as a view transition. Not yet: accessibility pass, keyboard, reduced motion, touch, Safari, Firefox, performance, and the workflow on GitHub.

## During implementation

- Run Astro's type and content checks and a production build.
- Write tests only for behaviour that exists: theme switch, search, table of contents, code copy, mobile navigation. No tests that mirror static markup.
- Inspect full pages, not only the first screen, at 320, 390, 768 and 1440px and on a short laptop viewport. Look at wrapping, image crops, margins, overflow and anything sticky covering content.
- Run `web-design-guidelines` on the source and Taste's `scripts/lint.mjs` on the project. The second catches the font, mono-label, hairline and eyebrow tells listed in DESIGN.md.
- Keyboard access, visible focus, heading order, link text, alt text, 200% zoom and touch targets. Never disable browser zoom.

## Design system

- Tokens are declared once with `light-dark()`. No hard-coded colour in a component.
- Re-measure contrast for any token that changes. Each of ink, muted and accent must stay at 4.5:1 or better on ground, raised, sunken and all four fields, in both themes.
- Monospace appears only in code. One radius. Hairlines only between list rows and above footnotes.
- Hero headline is two lines at 1440px and no more than three at 390px.
- Diagrams are legible at 390px (stacked variant or horizontal scroll), follow the theme, and are never inverted.

## Themes

- Light, Dark and System on both sites at phone and desktop widths.
- First visit, reload, moving between portfolio and blog, a second tab left open while the choice changes, an OS change while System is selected.
- JavaScript disabled: the site follows the OS setting and the switch is hidden or inert, not broken.
- Storage blocked (private window, site data disabled): the switch still works for the current page view.
- No wrong-theme flash on first paint, checked with a throttled connection.
- Code blocks, figures, focus rings, captions and tables reviewed separately in each theme.
- The choice made on the portfolio holds on the blog and the reverse. Safari clearing it after seven days without a visit is expected behaviour, not a bug.

## Portfolio

- Work, case-study, résumé, email, GitHub, LinkedIn and blog links reach the right place.
- `/privacy-policy/` and `/static/resume.pdf` load at their existing addresses.
- Every claim on the page traces to something Vamsi confirmed: dates, employer and client naming, metrics, the award.
- The hero sequence runs once, leaves the page complete if it fails, and does nothing under reduced motion.
- Back and forward navigation, anchor offsets and resizing leave no duplicate animation listeners or stuck scroll state.

## Blog

- Index with zero, one and many posts. Search including its empty state. Topic chips. Activity map matches the real post dates.
- Article: table of contents by keyboard, heading links, footnotes and their return links, code copy feedback, captions, image zoom, wide tables and code that scroll inside their own box without widening the page.
- A representative article at 200% zoom, with JavaScript disabled, and with reduced motion.
- Drafts appear nowhere: pages, search index, feed, sitemap, related lists, the portfolio's Writing section.
- The PaperMod sample posts are absent from `src/content/`.
- Dates show the intended day in time zones either side of UTC. `publishedAt` is the original date; `updatedAt` is set only for real edits.
- Feed validates. Social images render for a long title and a short one.

## One site, two halves

- Links between portfolio and blog work in both directions, including post-to-project links and the Writing section.
- `/terminal-logs.html` forwards to `/blog/`, with no loop. `www` redirects to the apex.
- Every internal link and asset works under `/blog/` as well as at the root; nothing assumes it is served from `/`.
- Canonical tags, the feed, the sitemap, the robots file and social metadata all name `https://mvamsi.com`. No `localhost` or `/hugo-PaperMod/` URL ships.
- Search results from Pagefind contain blog articles only, not portfolio pages.
- Analytics loads once per page.
- The deploy workflow publishes from `main` only, and a failed build leaves the previous site in place.

## Performance and search

Targets to measure on a throttled phone profile, not claims: LCP 2.5s or less, INP 200ms or less, CLS 0.1 or less. Images have dimensions and responsive sources; offscreen media loads lazily; only the two first-paint font files are preloaded; a blog article ships no animation library. Check titles, descriptions, 404 pages and that the console is free of errors and missing assets.
