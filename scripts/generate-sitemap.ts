import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');

const siteUrl = 'https://krexizm.cc';

const routes = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: 'profile', changefreq: 'weekly', priority: '0.8' },
  { path: 'education', changefreq: 'monthly', priority: '0.6' },
  { path: 'work', changefreq: 'weekly', priority: '0.8' },
  { path: 'connect', changefreq: 'monthly', priority: '0.6' },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${siteUrl}/${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap);
console.log('✓ sitemap.xml generated');
