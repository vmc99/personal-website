// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://mvamsi.com',
  trailingSlash: 'always',
  integrations: [
    // Must come before mdx so code blocks in .mdx posts are handled too.
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      // Follow the site's theme switch: data-theme on <html> pins a theme,
      // otherwise the OS preference decides (useDarkModeMediaQuery).
      themeCssSelector: (theme) => (theme.type === 'dark' ? '[data-theme="dark"]' : '[data-theme="light"]'),
      useDarkModeMediaQuery: true,
      styleOverrides: {
        borderRadius: '4px',
        codeFontFamily: "'JetBrains Mono Variable', ui-monospace, monospace",
        uiFontFamily: "'Hanken Grotesk Variable', system-ui, sans-serif",
        borderColor: 'transparent',
        codeBackground: 'var(--sunken)',
        frames: {
          frameBoxShadowCssValue: 'none',
          editorTabBarBackground: 'var(--raised)',
          editorActiveTabBackground: 'var(--sunken)',
          terminalBackground: 'var(--sunken)',
          terminalTitlebarBackground: 'var(--raised)',
          terminalTitlebarBorderBottomColor: 'transparent',
        },
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
});
