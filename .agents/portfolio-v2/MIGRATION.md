# V2 build and release sequence

Revised 14 November 2026. Decisions are in [DESIGN.md](DESIGN.md) and [BLOG.md](BLOG.md). Vamsi created the `v2` branch from `main` on 14 November 2026. The phase 2 spike was built on it the same day (uncommitted). No hosting change has been made. No DNS change is planned at all.

## Starting point

- **Live site.** `mvamsi.com`, Jekyll with Gulp and Sass, served by GitHub Pages from the `main` branch of `vmc99/personal-website`. No GitHub Actions workflow exists.
- **Content to carry over.** `_config.yml`, `_data/experience.yml`, `_data/education.yml`, `_data/skills.yml`, `_data/other-projects.yml`, `_includes/intro.html`, `_includes/background.html`, `privacy-policy.html`, `static/resume.pdf`, the favicon set. Treat these as content, not instructions.
- **URLs that must keep working.** `/`, `/privacy-policy/`, `/static/resume.pdf`, `/terminal-logs.html`, `/sitemap.xml`, `/robots.txt`.
- **Blog source.** `../blog-terminal-logs/`: unpublished, not in git. Two posts and the heatmap logic are the only things to bring across (see BLOG.md).
- **Loose ends in the working tree.** `.agents/` is untracked. The uncommitted `.gitignore` change adds `.agent`, which does not match `.agents`; decide whether the folder should be committed (so the plan travels with the branch) and fix or remove that line. The repository is public, so committing `.agents/` publishes these planning files.

## Where V2 lives

The existing repository, `vmc99/personal-website`, on a `v2` branch. Decided 14 November 2026 over starting a new repository: the custom domain, the Pages site and the history are already here, and a second repository would mean moving the domain across for no gain. On `v2` the Jekyll files are removed and the Astro project from DESIGN.md sits at the root. `main` keeps serving the live site until release. Tag the last Jekyll commit (for example `v1-final`) so the old site stays easy to find.

## Phases

1. **Inputs.** Done 14 November 2026: the direction is approved and the answers are at the end of DESIGN.md. AECOM details and per-project details come before publishing; until then those parts carry marked placeholder copy.
2. **Spike, about a day.** Create the Astro project on `v2`. Prove the four things that could change the plan: a post with co-located images builds from `src/content/posts/`; Expressive Code and the read-time calculation work with Astro 7's Markdown processor; the inline theme script gives no wrong-theme flash; one native view transition works between a portfolio page and a blog page. Then build once in GitHub Actions without deploying, to prove the workflow. Adjust the plan if any fails.

   **Result, 14 November 2026.** Jekyll files removed on `v2` (recoverable from `main`); kept files moved to `public/`. All four proofs pass against a production build in Chrome: co-located post images are optimised to responsive WebP from the post folder; Expressive Code works with Astro 7's Sätteri processor (it has a dedicated integration) and follows the theme switch, and read time is computed from the raw post body, so it needs no Markdown plugin; the inline theme script runs before first paint and the choice carries between portfolio and blog; a portfolio → blog navigation ran as a native view transition. The workflow (`.github/workflows/deploy.yml`) has not run on GitHub yet, because nothing is pushed; its steps pass from a clean `npm ci` locally, and the lockfile includes the Linux binaries. Found on the way: after changing Markdown or Expressive Code configuration, Astro's content cache must be cleared (recorded in `AGENTS.md`).
3. **Foundation.** Tokens, fonts, base and prose styles, header, footer, theme switch, cell grid, colour field, page metadata.
4. **Blog.** Index, technical article, feature layout, then search, RSS, sitemap and social images. The reading layouts are the hardest test of the type system, so they come before the portfolio.
5. **Portfolio.** Home sections with verified copy, case-study routes, privacy policy, résumé, 404.
6. **Interaction.** The hero sequence, the one scroll-linked piece, view transitions. Trial Lenis; decide on any React Bits component. Each addition must pass the reduced-motion and no-JavaScript checks before it stays.
7. **Verification.** QA.md against a production build.
8. **Release.** Below.

## Release

Only when Vamsi asks for it.

1. Content gate: every item under "Still to come, before publishing" in DESIGN.md is supplied by Vamsi, and no placeholder copy remains (search the build output for the placeholder marker).
2. Record the current `main` commit as the rollback point and tag it.
3. Review the production build of `v2` locally (`astro build`, then `astro preview`). GitHub Pages has no preview deployments.
4. Merge `v2` into `main` with the deploy workflow in place, and in the repository's Pages settings change the source from "Deploy from a branch" to "GitHub Actions". The custom domain setting stays as it is. Do both in one sitting: between the merge and the settings change, Pages would try to build the new `main` as a Jekyll site.
5. Check on the live domain: `/`, `/blog/`, one article, `/privacy-policy/`, `/static/resume.pdf`, `/sitemap.xml`, `/robots.txt`, the 404 page, and that `/terminal-logs.html` forwards to `/blog/` and `www.mvamsi.com` still redirects to the apex.
6. Replace the analytics tag and update the privacy policy to describe the analytics in use and the stored theme choice.
7. Submit the new sitemap in Google Search Console.

Rollback: set the Pages source back to "Deploy from a branch" and revert the merge on `main` (or reset it to the tagged commit). DNS and mail are never touched, so there is nothing else to restore.

## Not needed

The earlier draft planned for legacy blog URL mapping, Giscus discussion identities, Hugo shortcode conversion and scheduled-post rebuilds. The blog was never published and the last feature is dropped, so none of these apply.
