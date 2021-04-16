import StringUtils from './stringUtils.js';
import ImgLoader from './imgLoader.js';
import path from 'path';
import UrlUtils from './urlUtils.js';

const markdown_it = require('markdown-it');
const hljs = require('highlight.js');
const katex = require('@iktakahiro/markdown-it-katex');

export default class MdParser {
    constructor() {
    }

    static markdownParser(ctx, basePath, taskQ) {
        return markdown_it({
            linkify: false,
            highlight: MdParser.highlight,
        })
        .use(katex)
        .use((md, config) => {
            md.renderer.rules.image = MdParser.image(ctx, basePath, taskQ);
        });
    }

    static highlight(code, language) {
        if (!(language && hljs.getLanguage(language))) {
            // use 'markdown' as default language
            language = 'markdown';
        }

        const result = hljs.highlight(code, { language }).value;
        return StringUtils.escapeTmpl`<pre><code class="hljs ${language}">${result}</code></pre>`;
    }

    static image(ctx, basePath, taskQ) {
        return (tokens, idx, _1, _2, _3) => {
            const token = tokens[idx];
            const src = token.attrs[token.attrIndex('src')][1];
            const txt = token.content;

            const imageIds = ImgLoader.loadSync(ctx, path.resolve(basePath, src), taskQ);

            return `
                <picture>
                    <source type="image/avif" srcset="$\{${UrlUtils.metaAsset(imageIds.avif)}}"/>
                    <source type="image/webp" srcset="$\{${UrlUtils.metaAsset(imageIds.webp)}}"/>
                    <img src="$\{${UrlUtils.metaAsset(imageIds.jpeg)}}" alt="${txt}" loading="lazy" decoding="async"/>
                </picture>
            `;
        };
    }
}