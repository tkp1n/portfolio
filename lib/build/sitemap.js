import path from 'path';
import fs from 'fs';
import util from 'util';

const writeFile = util.promisify(fs.writeFile);

export default class SitemapGenerator {
    static #root(body) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${body}
</urlset>`;
    }

    static #site(url) {
        return `<url> <loc>${url}</loc> <changefreq>daily</changefreq> <priority>0.7</priority> </url>`;
    }

    static async generate(baseUrl, relUrls, targetDir) {
        const saneBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

        const targetFile = path.resolve(targetDir, 'sitemap.xml');
        await writeFile(targetFile, SitemapGenerator.#root(
            [
                '/',
                ...relUrls
            ].map(x => SitemapGenerator.#site(saneBaseUrl + x)).join('\n')
        ));
    }
}