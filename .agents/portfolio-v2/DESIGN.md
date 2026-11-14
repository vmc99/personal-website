# Vamsi Mukkamala — V2 design and stack

Revised 14 November 2026. This replaces the earlier draft (kept in `superseded-2026-11-13/`). It covers one site with two halves: the portfolio at `mvamsi.com` and the blog, Terminal Logs, at `mvamsi.com/blog/`. Blog-specific detail is in [BLOG.md](BLOG.md), the build order in [MIGRATION.md](MIGRATION.md), checks in [QA.md](QA.md). "Both sites" below means those two halves.

Open `preview/design-system.html` in a browser to see the direction below in both themes. It was rendered and checked at 320, 390, 768 and 1440px. The direction is a proposal until Vamsi approves it; everything else here follows from it.

## Goal and audience

An engineering hiring manager, collaborator or client should understand in one screen what Vamsi builds, be able to inspect two or three pieces of real work, and reach him. The strongest material is the line through software engineering, automation and AI-assisted code modernisation. Show it through projects and writing, not a technology inventory.

## What changed from the earlier draft, and why

| Topic | Earlier draft | Now | Reason |
| --- | --- | --- | --- |
| Visual system | Dark lime-on-black portfolio, separate serif "paper" blog | One system, **Logbook**, for both sites | Two unrelated looks is the opposite of an integrated site. The dark-ground-plus-neon-accent hero is also listed as a generated-look tell in the installed Taste skill (`references/tells.md`). |
| Typeface | Space Grotesk for everything | Newsreader, Hanken Grotesk, JetBrains Mono | Space Grotesk is a weak long-form text face and is flagged by Taste's own linter (`default-font`). |
| Themes | "Required", but only one light and one dark hero colour defined | Full light and dark token sets, contrast-checked | The old plan had a fixed dark hero with no answer for what it becomes in the light theme. |
| Styling | CSS custom properties, Tailwind "optional" | Plain CSS with tokens, no Tailwind | Decided rather than deferred. See Stack. |
| React | React islands assumed | No React by default | It was only there for React Bits. Add it per island if a component earns it. |
| Vanta | "Later experiment" | Dropped | Last published to npm in September 2022; preset effects that read as a template. |
| Search, code blocks, social images | Not chosen | Pagefind, Expressive Code, build-time OG images | Decided rather than deferred. |
| Hosting | Unknown | GitHub Pages, as today, deployed by a GitHub Actions workflow | See Hosting. |
| Hugo migration | Legacy URL mapping, Giscus identity mapping, shortcode conversion | Almost none needed | The blog was never published, is not in git, and `blog.mvamsi.com` has no DNS record. See BLOG.md. |
| Framework version | "Astro", unpinned | Astro 7 | Current major as of this date. |
| Blog address | `blog.mvamsi.com`, two apps in one repository | `mvamsi.com/blog/`, one Astro project | Decided by Vamsi on 14 November 2026. One origin, one build, no DNS change. |

Unchanged: Astro, Light / Dark / System, GSAP as the animation engine, the portfolio page order.

## Direction: Logbook

**The idea.** Vamsi already owns two marks that are the same shape: the logo (a V drawn from five dots) and the posting-activity heatmap he built for the Hugo blog. Both are cells on a grid, filled in over time, which is what a log is. Logbook makes that the single motif: the logo, the hero graphic, the blog's activity map, and the generated cover for any post that has no artwork are all the same cell grid.

**What it borrows from the Anthropic pages Vamsi likes.** The structure: a serif for titles and long reading, a calm off-white reading surface, a narrow text column with wider breakouts for figures and code, quiet metadata, solid colour blocks for featured items, captioned diagrams.

**What it does not borrow.** Anthropic's identity: the cream ground with a clay accent, and their typefaces. That combination is also the most copied look of the last two years. Logbook uses a low-chroma stone ground, a deep green ink accent taken from terminal phosphor, and a set of four field colours.

**Rules that keep it from looking generated.** These come from checking the direction against `references/tells.md`:

- Monospace is for code and commands only. No mono labels, no mono dates. Dates use the sans with tabular figures.
- No tracked-uppercase eyebrows, no "01 / 02" numbering, no status dots, no emoji as icons.
- Structure comes from space and tone steps. A hairline is allowed between rows of a list and above footnotes, nowhere else. No shadows, no outlined cards.
- One radius, 4px. Fully round only for chips and the theme switch.
- Headlines are short: two lines at desktop width.

### Colour tokens

Implement each token once with `light-dark()` and let `color-scheme` choose. No duplicated dark block.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--ground` | `#F2F1EC` | `#141613` | Page background |
| `--raised` | `#E8E6DF` | `#1D201C` | Chips, inline code, empty cells |
| `--sunken` | `#DEDCD3` | `#0F110E` | Code blocks |
| `--ink` | `#191B18` | `#E9E7E0` | Text |
| `--muted` | `#575A54` | `#A4A79F` | Secondary text, captions, dates |
| `--line` | `#CFCDC3` | `#33372F` | The few permitted hairlines |
| `--accent` | `#0E6A4B` | `#7FDCAB` | Links, primary button, focus ring, filled cells |
| `--accent-hover` | `#0A5139` | `#A5EBC5` | Hover and active |
| `--on-accent` | `#F2F1EC` | `#0F1A14` | Text on accent |
| `--field-green` | `#CBE3D2` | `#1D3A2C` | Colour fields: project blocks, featured post, covers, diagram fills |
| `--field-blue` | `#CEDCEC` | `#1D3046` | Same |
| `--field-amber` | `#EFDDA8` | `#43371A` | Same; also text selection |
| `--field-plum` | `#E3D2E6` | `#39283E` | Same |

Measured contrast (WCAG 2): ink on ground 15.3 light / 14.7 dark; muted on ground 6.2 / 7.5; accent on ground 5.8 / 11.0; on-accent on accent 5.8 / 10.8. The lowest text pairing in the system is accent on `--field-plum` in light at 4.6, so every pairing of ink, muted or accent on ground, raised, sunken or a field clears 4.5:1. Re-measure if a value changes.

The contact band at the foot of both sites is the one inverse surface: `--ink` as its ground and `--ground` as its text, in both themes.

Assign a field colour per project and per blog topic and keep it stable, so colour carries meaning across both sites.

### Typography

| Role | Face | Where |
| --- | --- | --- |
| Serif | Newsreader (variable, optical size, italics) | All headlines on both sites; article prose, deks, pull quotes |
| Sans | Hanken Grotesk (variable) | Navigation, metadata, captions, buttons; body text on the portfolio |
| Mono | JetBrains Mono (variable) | Code blocks and inline code only |

All three are SIL OFL 1.1. Self-host them (Fontsource variable packages or Astro's font configuration), Latin subset, preload only the serif roman and the sans on first paint. Their licence files are in `license-evidence/` (added 14 November 2026, from the Fontsource packages). The Apercu files from the Jekyll site are a commercial face with no licence evidence and were not carried over.

The split gives each site its own voice inside one system: the portfolio reads in the sans under serif headlines; the blog reads in the serif.

Five sizes, far apart:

| Step | Size | Setting |
| --- | --- | --- |
| Display | `clamp(3rem, 1rem + 8.5vw, 7.5rem)` | Newsreader 400, tracking −0.03em, leading 0.98, `text-wrap: balance` |
| Heading | `clamp(2rem, 1.4rem + 2.6vw, 3.5rem)` | Newsreader 400, −0.02em, leading 1.04 |
| Lead | `clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)` | Leading 1.35 |
| Body | `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)` | Hanken Grotesk 400, leading 1.5, max 62ch |
| Small | `0.875rem` | Captions, dates, metadata. Never smaller. |

Article prose is the one extra setting: Newsreader at `clamp(1.1875rem, 1.1rem + 0.3vw, 1.3125rem)` (19–21px), leading 1.68, because Newsreader runs small beside a grotesk.

### Layout

- Page width 1240px, gutters `clamp(20px, 4vw, 48px)`.
- Reading column 42rem (about 68 characters of prose); breakout width 58rem for code, figures and tables.
- Spacing scale: 4, 8, 16, 24, 40, 64, 104, 168px.
- Left-anchored compositions. Vary the layout between sections.
- Figures are inline SVG drawn with the tokens so they follow the theme. Never invert images. A diagram wider than the phone column needs a stacked variant or horizontal scroll; the preview simply scales its diagram down, which is too small at 390px.

### Components to build once

Sticky header with the mark and four links (Work, About, Blog, Contact) that condenses on scroll, theme switch, cell grid (logo, hero, heatmap, generated cover), colour field block, button, chip, post row, code block frame, figure with caption, footnotes, inverse contact footer.

## Portfolio page structure

1. **Hero.** Headline from Vamsi's own line: "I design, build and automate things." A supporting sentence with name, role, location and the most recent work. Two actions: selected work, email. The owl in the cell field (see below). Drop the 1.1–1.4MB VR statue image and replace the old loading animation with the short intro described below.
2. **Selected work.** Two colour fields: Anti-Pattern Resolutor and Chameleon. A third only if it has real media; the Zoom bot is the better candidate than Pixely because it is an automation story with stated adoption. Each links to a case study at `/work/<slug>/`.
3. **Experience.** Short entries. Keep employer, client and university relationships exact ("Accenture, client: Cigna"; "IBM Research with UCL").
4. **About.** Three or four sentences and capabilities written as prose grouped by what the projects demonstrate. No logo wall.
5. **Writing.** Two or three real posts, linking to `/blog/`. Omit the section until two real posts exist.
6. **Contact.** The inverse band: email, résumé, GitHub, LinkedIn.

### Hero, mark, header, footer, intro and blog landing: decided (updated 14 November 2026)

Rendered in `preview/portfolio-home.html` and `preview/blog-home.html`. Each keeps a small "Preview options" panel: the portfolio's replays the intro and sends the owl to sleep; the blog's replays its intro.

Decided by Vamsi:

- **Hero graphic: an owl drawn in the cell field, no V.** The grid bleeds off the right edge of the page and fades out on all four sides. The V is no longer drawn in it; the logo lives in the header. A small owl, 12 by 13 cells, sits in the field on small cells, in the greens: `--t1` body, `--t2` belly, `--accent` beak and feet. Its eye whites and pupils have their own pair of tokens so that in dark the pupils go dark and the whites bright. It looks at the headline when nobody is there and follows the pointer anywhere on the page, a cell at a time; its eyes smile into arcs when the pointer comes close; it flaps when clicked and a ring of cells goes out across the field; it blinks with the header logo; and eight seconds after the pointer last moved it closes its eyes and sleeps, with Z's made of cells drifting out of the top of the field. Field cells light up under the pointer. Chosen 14 November 2026 over pixel, round and crowd eyes, nine other cell characters, and Ink and Field colourings: green keeps it with the mark, and the field colours stay reserved for projects and topics.
- **Footer: Twinkle, on both sites.** A strip of the same cells beside "Say hello back.", fading on all four sides. Now and then one cell warms to `--t1` and fades back over 1.6s, about one every 0.65s. Nothing follows the pointer. The band is the inverse surface, so its cells use that scheme's tokens. Static under reduced motion.
- **Portfolio mark: Cells.** The V as five square cells in the accent colour. A solid tile version is the favicon and app icon (built 14 November 2026: `public/favicon.svg` follows the OS theme; the PNG and ICO sizes use the light tile). It replaces the old five-circle logo.
- **Blog mark: Prompt.** The same V turned on its side to make a `>`, with a cursor cell. On a visit where the intro plays, the intro does the turn and the header mark only blinks its cursor three times once the intro lands on it; on later visits in the session it turns once on load and the cursor blinks three times.
- **Sticky header timing.** Timed against the Anthropic wordmark, which was measured in Chrome on 13 November 2026: it is triggered once the page is scrolled past roughly 16px, runs about 0.63s on one easing curve, and is not tied to scroll position. Ours does the same: one move of 0.64s on `cubic-bezier(.25, .1, .25, 1)`, triggered at 16px and reversed at the top. Only `clip-path`, `transform` and `opacity` animate; the header keeps one height, so the page never shifts. On the blog the name is wiped and the prompt mark stays.
- **Portfolio header: Owl.** In that move the name is wiped and the V closes up into the owl's face, which it already is: two ear tufts, two eyes, a beak. The tufts drop a little and shrink, the eyes rise, and the beak tucks up small under them. Once condensed, the eyes follow the pointer by about a cell's width and blink with the hero owl. At the top it opens back into the V, whose tips blink instead. Each cell of the mark is its own SVG group, so a cell can move while its eye looks around inside it. Chosen 14 November 2026 over Backspace, Roll, Wipe and the first version, in which "Mukkamala" slid over a wiped "Vamsi" and its M became a cell M.
- **The header logo blinks.** Every few seconds, in time with the owl in the hero: the two tips of the V squash for an instant at the top of the page, and the owl's eyes once the header has condensed. It stops eight seconds after the pointer last moved and is off under reduced motion.
- **Intro: Draw, on both sites.** Once per session on each site, skipped under reduced motion, drawn over a page that is already rendered. Portfolio: the V is drawn cell by cell, then travels to the mark's position in the header; about one second. Confirmed 14 November 2026. Blog: the same V is drawn cell by cell, turns on its side into the prompt, the cursor cell arrives and blinks once, and the whole mark travels to the header, where the cursor blinks three more times; about 1.6 seconds. Added 14 November 2026.
- **Blog landing.** The large Terminal Logs title with the one-line description under it, the 26-week log grid to the right, and the newest post below as a colour field with a generated cover. The description names the author and links to the portfolio.
- **Activity map: posts only.** One dark cell per published post, placed by the post's date, over the last 26 weeks. Nothing else is counted: no git history, no draft activity. The map will be nearly empty at launch; accepted. Decided 14 November 2026 over also counting commits to the posts folder.
- **Activity map: a post cell previews its post.** Hovering a post cell, or focusing it from the keyboard, shows a small card above it (below it when the header is in the way): the post's generated cover on its topic's field colour, the date and topic, the title in the serif and the read time. The card has a border, no shadow, and fades in over 0.15s, without the 4px rise under reduced motion. On touch the first tap opens the card and the card is the link; a tap elsewhere closes it. Screen readers get the date and title in the cell's label and follow the link straight away. Empty cells show nothing. Added 14 November 2026; the data comes from each post's front matter.

Nothing in this section is still open.

Case study order: problem, constraints, contribution, system design, evidence, lessons, links. The before/after code view from the earlier draft belongs inside the Anti-Pattern Resolutor case study, built only from public code in that repository. Do not invent metrics or screenshots.

## Motion

| Library from the brief | Decision |
| --- | --- |
| GSAP | Use, portfolio only. The intro and one hero sequence (see the hero section above), plus the owl. The blog's intro is short and linear enough for the Web Animations API, so the blog still ships no GSAP. The header condensing needs no library: a class toggled at a scroll threshold and CSS transitions. At most one scroll-linked piece in Selected work. All plugins are free under GSAP's standard licence since 2025. | **Built 15 November 2026 without it:** the intros run on the Web Animations API and the owl is a small cell renderer, about the same as the preview; GSAP is not installed. Add it only if the one scroll-linked piece in Selected work needs it.
| View transitions | Add. Native cross-document transitions: a project field grows into its case-study header, a post row into the article title, and the header carries across between portfolio and blog, which is possible because both are on one origin. CSS only. Works in Chromium and Safari 18.2+; Firefox support is partial and simply navigates. |
| Lenis | Off by default. Trial on the portfolio home in the interaction phase; keep only if anchors, keyboard scrolling, find-in-page and history all still behave. Never on the blog. |
| React Bits | None by default. If one component is wanted, add `@astrojs/react`, take the TypeScript + CSS variant, restyle it with the tokens, hydrate with `client:visible`, portfolio only. Licence is MIT with Commons Clause (see `license-evidence/`). |
| Vanta | Dropped. |

Content must be complete with JavaScript off. Honour `prefers-reduced-motion`. No fade-up on every section. The blog has no scripted motion beyond its intro, interface feedback and the view transition.

## Stack

Versions are the latest on the npm registry on 13 November 2026. Pin exact versions at setup.

| Concern | Choice |
| --- | --- |
| Framework | Astro 7 (7.4.x), static output, TypeScript 7. Needs Node 22.23+; Node 24.2 is installed locally. |
| Project | One Astro project at the repository root, one `package.json`. No workspace, no shared package. |
| Styling | Plain CSS: custom properties, `light-dark()`, cascade layers, nesting, Astro scoped styles. No Tailwind: the design is a small token set plus prose styles, which utility classes do not help with. |
| Content | Markdown, MDX only where a post needs a component. Astro content collections with a shared Zod schema. |
| Code blocks | Expressive Code (`astro-expressive-code`): copy button, file-name and terminal frames, line marking, paired light and dark themes. |
| Search | Pagefind, run after the build, indexing blog articles only. |
| Feeds and maps | `@astrojs/rss` for the blog feed at `/blog/rss.xml`; `@astrojs/sitemap` for one sitemap covering the whole site. |
| Social images | Generated at build time from the cell grid and the post title. |
| Animation | GSAP 3.15 on the portfolio. Lenis 1.3 only if it survives the trial. |
| Analytics | No cookies anywhere on the site, so no consent banner. The current GA4 tag sets cookies and is removed. In its place: Google Search Console for search traffic (no script on the page), plus at most one cookieless counter, chosen at release. Rewrite the Cookies and Analytics sections of the privacy policy to match. |

Verified in the spike on 14 November 2026: Astro 7's default Markdown processor is Sätteri, not remark/rehype; Expressive Code supports it directly; read time comes from the raw post body; co-located images are optimised from the post folder. Remark and rehype plugins are not used.

### Repository layout

```text
src/pages/                   → portfolio: /, /work/<slug>/, /privacy-policy/, 404
src/pages/blog/              → blog: /blog/, /blog/<slug>/, /blog/topics/<topic>/, /blog/rss.xml
src/content/posts/<slug>/    → index.md or index.mdx plus its images
src/content/projects/        → case studies
src/components/, src/layouts/, src/styles/tokens.css
src/site.ts                  → author, navigation, social links
public/                      → CNAME, favicon set, static/resume.pdf, terminal-logs.html
.github/workflows/deploy.yml → build and publish to GitHub Pages
```

The same repository as the live site, `vmc99/personal-website`, on a `v2` branch until release (see MIGRATION.md). The blog has its own layouts and its own header brand, but shares every token and component with the portfolio because it is the same project.

Next.js remains the alternative only if the site later needs accounts or server-rendered data.

### Hosting

Decided by Vamsi on 14 November 2026: stay on GitHub Pages, with the blog at `mvamsi.com/blog/`.

Verified on 13 November 2026: `mvamsi.com` is served by GitHub Pages from `vmc99/personal-website`; DNS is at Namecheap; mail for the domain uses Namecheap's forwarding (MX `eforward*.registrar-servers.com`); `/terminal-logs.html` returns 200 and `/blog/` returns 404. None of the DNS or mail set-up changes.

- **Deploy.** A GitHub Actions workflow builds the Astro site and publishes it with the Pages actions. At release, the repository's Pages source changes from "Deploy from a branch" to "GitHub Actions". The custom domain stays attached to the repository.
- **What Pages does not give, and what replaces it.** No preview deployments: review with `astro build` and `astro preview` locally. No server redirects: the one old address that needs one, `/terminal-logs.html`, becomes a small static page in `public/` with a meta refresh and a canonical link to `/blog/`. No custom response headers: accepted; Pages sets its own caching.
- **The repository is public** (it answers an anonymous `git ls-remote`, checked 14 November 2026). A post marked `draft: true` is left out of the site but is readable on GitHub once pushed. Keep unfinished posts on an unpushed branch if that matters.
- **Limits.** One Pages site per repository and a 1GB published size. Neither is close.
- **Search.** A subfolder is indexed like any other page of the site. One sitemap lists every page; each article has its own title, description, canonical URL and social image; the blog has its own feed.

Moving to Cloudflare or Vercel later needs no code change. It would only be worth it for preview deployments or custom headers, and Cloudflare would mean moving nameservers and recreating mail forwarding in the same sitting.

## Themes

- Light / Dark / System on both sites, System by default.
- System needs no script: `:root { color-scheme: light dark }` and `light-dark()` tokens follow the OS. Light and Dark set `data-theme` on `<html>`, which pins `color-scheme`.
- The explicit choice is stored in `localStorage` under `theme` (`light` or `dark`). Choosing System removes it. An inline script in `<head>` reads it and sets `data-theme` before first paint. Portfolio and blog share it because they are one origin; no cookie is needed.
- Safari can clear script-written storage after seven days without a visit, so there an explicit choice may revert to System. Accepted.
- Listen for the `storage` event so an open tab follows a change made in another tab.
- Point Expressive Code's theme selector at `data-theme` so code follows the switch.
- Switching cross-fades the whole page over 0.45s with a view transition, instead of per-element colour transitions, so code blocks and images fade with everything else. Instant under reduced motion and in browsers without view transitions. Built 14 November 2026.

## Inputs from Vamsi

Answered 14 November 2026.

1. **Direction.** Logbook is approved for the portfolio and the blog.
2. **Current facts.** The MSc, the student ambassador role and the IBM role all ended by September 2025. Vamsi now works at AECOM as a software engineer in the AI for engineering team. The hero sentence and the first Experience entry lead with AECOM; no "Present" on the MSc or IBM entries and no "looking for work" wording anywhere.
3. **Email.** `hello@mvamsi.com` is the public contact address. `query@mvamsi.com` stays as the contact on the privacy policy. Both forward to a Gmail inbox; the Gmail address itself is not shown on the site.
4. **Accounts.** GitHub is `vmc99`. The `vamsimukkamala` handles in the old Hugo config are placeholders and are not used.
5. **Hosting.** `mvamsi.com/blog/`, one site, on GitHub Pages, in the existing repository.

### Still to come, before publishing

Build with clearly marked placeholder copy for these; none of it may ship as written.

- AECOM: start date, exact title, and what may be said publicly about the work.
- Each selected project: personal contribution, any metric that can be stated, and public screenshots or diagrams.
- LinkedIn: the live site links `linkedin.com/in/vmc99`. Carried over unless Vamsi says otherwise.
