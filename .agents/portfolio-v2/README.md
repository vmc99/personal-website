# Portfolio V2 toolkit and plan

Toolkit prepared 25 October 2026; plan revised 13 November 2026. Scope so far: tooling, design direction and decisions. No V2 code exists and nothing has been deployed.

## Read in this order

1. [DESIGN.md](DESIGN.md): the Logbook direction, tokens, type, motion, stack, hosting, themes, and Vamsi's answers with what is still to come before publishing.
2. `preview/design-system.html`: the direction rendered, with a Light / Dark / System switch. Open it in a browser. It loads its three fonts from Google Fonts for convenience; production self-hosts them.
3. `preview/portfolio-home.html` and `preview/blog-home.html`: the chosen hero, mark, header and intro, with the options still open switchable from a "Preview options" panel. They share `explore.css` and `explore.js`. DESIGN.md lists what is decided and what is open under "Portfolio page structure".
4. [BLOG.md](BLOG.md): Terminal Logs layouts, features, content model, and what to take from the old Hugo folder.
5. [MIGRATION.md](MIGRATION.md): build phases and the release checklist.
6. [QA.md](QA.md): what to check, and what has actually been checked.

Vamsi approved the Logbook direction on 14 November 2026.

## The brief's resources, and what each is used for

| Resource | Decision |
| --- | --- |
| [Taste skill](https://www.tasteskill.dev/) | Installed. Use it for the concept and build passes, and use its `references/tells.md` and `scripts/lint.mjs` as the check against generated-looking design. Logbook already follows its bans. Its "draw a direction" step would deal a different palette and type system; when running it, state that the direction in DESIGN.md is the brief and overrides the draw. |
| [GSAP](https://gsap.com/) | Use on the portfolio for one hero sequence and one scroll-linked piece. |
| [Lenis](https://lenis.dev/) | Trial on the portfolio home only; keep if it passes QA. Never on the blog. |
| [Vanta](https://github.com/tengbao/vanta) | Not used. Unmaintained since 2022 and off-direction. |
| [React Bits](https://reactbits.dev/) | Not used by default. One component at most, portfolio only, if it earns the React runtime. Licence is MIT with Commons Clause; a copy is in `license-evidence/`. |
| [Vercel web design guidelines](https://vercel.com/design/guidelines) | Installed as a skill. Run on implemented source. |
| [awesome-design-md](https://github.com/voltagent/awesome-design-md) | Reference for how DESIGN.md is written. Do not merge another brand's specification into it. |
| [OpenDesign image-to-code](https://open-design.ai/skills/image-to-code/) | Not installed; the linked skill path did not exist upstream when checked in October. Not needed for this plan. |
| [Playwright CLI](https://playwright.dev/agent-cli/introduction) | Installed and used to verify the preview. |
| [Free Faces](https://www.freefaces.gallery/) | Typeface discovery. The chosen faces (Newsreader, Hanken Grotesk, JetBrains Mono) are all OFL and available as Fontsource packages. |
| [Book of Shapes](https://bookofshapes.com/) | Not used. The cell grid is the only pattern. |
| [Recent](https://recent.design/) | Inspiration only. Nothing copied. |

## Installed skills

| Skill | Purpose | Folder |
| --- | --- | --- |
| `design-taste-frontend` (Taste V2) | Art direction, composition, typography, linting | `.agents/skills/design-taste-frontend/` |
| `web-design-guidelines` | Accessibility and interaction review | `.agents/skills/web-design-guidelines/` |
| `playwright-cli` | Browser inspection | `.agents/skills/playwright-cli/` |

Source commits and local additions are recorded in `sources.json`. Upstream SKILL.md files are unchanged. Each has `allow_implicit_invocation: false` in `agents/openai.yaml`, so in Codex they run only when invoked by name (`$design-taste-frontend`, and so on), from a session opened on this repository.

Claude Code looks for project skills in `.claude/skills/`, not `.agents/skills/`. To use the same three there, link each folder into `.claude/skills/`. Either tool can also simply be told to read a skill's SKILL.md.

Notes on Taste: its quotas and bans are upstream preferences, useful as a check, not requirements. Its draw script writes history to the home directory unless `TASTE_SKILL_HISTORY` points at a file in the workspace.

## Browser tooling

`.agents/portfolio-v2/tooling/` pins `@playwright/cli` 0.1.22 with a lockfile, separate from the site's own dependencies. It drives the installed Google Chrome; no browser binaries are downloaded.

```sh
npm --prefix .agents/portfolio-v2/tooling ci --ignore-scripts
npm --prefix .agents/portfolio-v2/tooling run browser -- -s=v2 open http://localhost:4321 --browser=chrome
npm --prefix .agents/portfolio-v2/tooling run browser -- -s=v2 resize 390 844
npm --prefix .agents/portfolio-v2/tooling run browser -- -s=v2 screenshot --filename=home-390.png --full-page
npm --prefix .agents/portfolio-v2/tooling run browser -- -s=v2 close
```

Run this way, the CLI writes its session logs to `tooling/.playwright-cli/`, which is already git-ignored. Pass an absolute path to `--filename`, or screenshots land there too. To view the preview the same way, serve `preview/` with any static server first.

## Suggested next prompt

> Read `.agents/portfolio-v2/DESIGN.md`, `BLOG.md` and `MIGRATION.md`. I approve the Logbook direction [with these changes: …]. Here are my answers to the six inputs in DESIGN.md: … Start MIGRATION.md phase 2 on a `v2` branch and stop after the spike to report what the four checks found.
