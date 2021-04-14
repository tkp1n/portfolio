import * as path from 'path';
import MdProcessor from './mdProcessor.js';
import StringUtils from './stringUtils.js';
import Constants from './constants.js';
import UrlUtils from "./urlUtils";
import Sharp from "./cSharp";
import SitemapGenerator from './sitemap.js';

class MdBuild {
    name = 'md-build';
    #baseUrl;
    #relBasePath;
    #basePath;
    #targetPath;
    #metaPath;
    #metaData;
    #store = {};
    #taskQ = [];

    constructor({baseUrl, basePath, targetPath}) {
        this.#baseUrl = baseUrl;
        this.#relBasePath = basePath;
        this.#basePath = path.resolve(process.cwd(), basePath);
        this.#metaPath = path.resolve(this.#basePath, 'meta.js');
        this.#targetPath = path.resolve(process.cwd(), targetPath);
    }

    async buildStart(ctx, options) {
        await Sharp.init();

        let result = `export default [`;
        const urls = [];
        for await (const data of MdProcessor.getMetaData(ctx, this.#basePath, this.#store, this.#taskQ)) {
            result += StringUtils.escapeStr`
            {
                title: '${data.title}',
                category: '${data.category}',
                imgUrls: {
                    avif: ${UrlUtils.metaAsset(data.imgUrls.avif)},
                    webp: ${UrlUtils.metaAsset(data.imgUrls.webp)},
                    jpeg: ${UrlUtils.metaAsset(data.imgUrls.jpeg)}
                },
                author: '${data.author}',
                date: '${data.date}',
                url: '${data.url}',
                html: ${UrlUtils.metaImport(data.htmlUrl)},
                abstract: '${data.abstract}'
            },`;
            urls.push(data.url);
        }
        result += `];`

        const id = ctx.emitFile({
            type: 'chunk',
            id: this.#metaPath
        });

        await SitemapGenerator.generate(this.#baseUrl, urls, this.#targetPath);

        this.#store[Constants.META_ID] = result;
    }

    async buildEnd(ctx, error) {
        if (error) {
            return;
        }

        for (const task of this.#taskQ) {
            await task;
        }
    }

    resolveId(ctx, source, importer) {
        if (!!this.#store[source]) {
            return source;
        }

        const fullPath = MdBuild.#fullJsFilePath(source, importer);
        if (fullPath === this.#metaPath) {
            return Constants.META_ID;
        }

        return null;
    }

    load(ctx, id) {
        const result = this.#store[id];
        if (!!result) {
            return result;
        }

        return null;
    }

    static #fullJsFilePath(source, importer) {
        if (!source.endsWith('.js')) {
            return null;
        }

        const dir = importer ? path.dirname(importer) : process.cwd();
        return path.resolve(dir, source);
    }
}

export default function mdBuild(options) {
    const builder = new MdBuild(options);

    return {
        name: builder.name,
        async buildStart(options) {
            await builder.buildStart(this, options);
        },
        async buildEnd(error) {
            await builder.buildEnd(this, error);
        },
        resolveId(source, importer) {
            return builder.resolveId(this, source, importer);
        },
        load(id) {
            return builder.load(this, id);
        }
    }
}