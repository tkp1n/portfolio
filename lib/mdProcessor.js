import fs from 'fs';
import util from 'util';
import matter from 'gray-matter';
import path from 'path';
import ImgLoader from './imgLoader.js';
import MdParser from './mdParser.js';
import FS from "./fsUtils";

const readFile = util.promisify(fs.readFile);

export default class MdProcessor {
    constructor() {
    }

    static async *getMetaData(ctx, baseDir, store, taskQ) {
        for (const subDir of await FS.listSubdirectories(baseDir)) {
            const relSubDir = path.resolve(baseDir, subDir);
            const mdPath = path.resolve(relSubDir, 'index.md');

            const mdContent = await readFile(mdPath);
            const parseResult = matter(mdContent);
            const data = parseResult.data;

            data.imgUrls = await ImgLoader.loadAsync(ctx, path.resolve(relSubDir, data.cover));

            const dirNameParts = subDir.split('--');

            const md = MdParser.markdownParser(ctx, relSubDir, taskQ);
            const html = md.render(parseResult.content);
            const js = `export const CONTENT = \`${html}\`;`;
            const fileId = `${dirNameParts[1]}.js`;

            const refId = ctx.emitFile({
                type: 'chunk',
                id: fileId
            });

            store[fileId] = js;

            yield {
                ...data,
                date: dirNameParts[0],
                url: `/${dirNameParts[1]}`,
                htmlUrl: refId
            };
        }
    }
}