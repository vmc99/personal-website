// Social images, generated at build time: 1200 by 630 PNG, light theme.
// Title in Newsreader on the stone ground, with a cell-grid cover on the topic's field colour.
// Satori turns the layout and text into SVG paths; sharp rasterises it. Build-time only.
import satori from 'satori';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import type { Field } from '../site';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`${pkg}/files/${file}`));
let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' }[]> | null = null;
const loadFonts = () =>
  (fonts ??= Promise.all([
    font('@fontsource/newsreader', 'newsreader-latin-400-normal.woff').then((data) => ({ name: 'Newsreader', data, weight: 400 as const, style: 'normal' as const })),
    font('@fontsource/hanken-grotesk', 'hanken-grotesk-latin-500-normal.woff').then((data) => ({ name: 'Hanken Grotesk', data, weight: 500 as const, style: 'normal' as const })),
  ]));

// Light-theme token values (tokens.css). Images are not themed.
const C = {
  ground: '#F2F1EC', ink: '#191B18', muted: '#575A54', accent: '#0E6A4B',
  field: { green: '#CBE3D2', blue: '#CEDCEC', amber: '#EFDDA8', plum: '#E3D2E6' } as Record<Field, string>,
};

// The same pattern as Cover.astro, so a post's social image matches its cover.
function coverLevels(slug: string) {
  let h = 2166136261;
  for (const ch of slug) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  h = (h >>> 0) % 1000;
  return Array.from({ length: 42 }, (_, i) => {
    const v = (Math.imul(i + 1 + h, 2654435761) >>> 0) % 97;
    return v < 10 ? 1 : v < 24 ? 0.52 : v < 44 ? 0.26 : 0.09;
  });
}

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

const markV = [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]];
const markPrompt = [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4], [4, 4]];
const mark = (cells: number[][], w: number, hgt: number, cell = 10) =>
  h('div', { display: 'flex', position: 'relative', width: w * cell, height: hgt * cell },
    cells.map(([c, r]) => h('div', { position: 'absolute', left: c * cell * 1.25, top: r * cell * 1.25, width: cell, height: cell, borderRadius: 2, background: C.accent })));

export async function renderOg(o: { title: string; kicker: string; brand: 'blog' | 'portfolio'; slug: string; field: Field }) {
  const levels = coverLevels(o.slug);
  const titleSize = o.title.length > 60 ? 60 : o.title.length > 36 ? 72 : 88;
  // Satori adds padding outside the given size, so the 64px margin is an explicitly sized inner frame.
  const tree = h('div', { display: 'flex', width: 1200, height: 630, background: C.ground }, h('div', { display: 'flex', width: 1072, height: 502, margin: 64, gap: 56 }, [
    h('div', { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }, [
      h('div', { display: 'flex', alignItems: 'center', gap: 18, fontFamily: 'Newsreader', fontSize: 34, color: C.ink }, [
        o.brand === 'blog' ? mark(markPrompt, 5, 5, 9) : mark(markV, 6, 3.5, 10),
        o.brand === 'blog' ? 'Terminal Logs' : 'Vamsi Mukkamala',
      ]),
      h('div', { display: 'flex', fontFamily: 'Newsreader', fontSize: titleSize, lineHeight: 1.02, letterSpacing: '-0.02em', color: C.ink }, o.title),
      h('div', { display: 'flex', fontFamily: 'Hanken Grotesk', fontSize: 26, color: C.muted }, o.kicker),
    ]),
    h('div', { display: 'flex', width: 360, background: C.field[o.field], borderRadius: 6, padding: 32, alignItems: 'flex-end' },
      h('div', { display: 'flex', flexWrap: 'wrap', gap: 8, width: 296 },
        levels.map((a) => h('div', { width: 42, height: 42, borderRadius: 4, background: C.ink, opacity: a })))),
  ]));
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
