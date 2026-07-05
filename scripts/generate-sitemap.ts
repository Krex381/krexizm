import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

const siteUrl = 'https://krexizm.cc';

const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/education', changefreq: 'monthly', priority: '0.8' },
  { path: '/work', changefreq: 'weekly', priority: '0.9' },
  { path: '/connect', changefreq: 'monthly', priority: '0.7' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml generated');
