import { basename, extname } from 'path';
import fs from 'fs';
import util from "util";
import Sharp from "./cSharp";

const readFile = util.promisify(fs.readFile);

export default class ImgLoader {

    static loadSync(ctx, id, taskQ) {
        const avif = ImgLoader.#emit(ctx, id, 'avif');
        taskQ.push(avif.task);

        const webp = ImgLoader.#emit(ctx, id, 'webp');
        taskQ.push(webp.task);

        const jpeg = ctx.emitFile({
            type: 'asset',
            name: basename(id)
        });
        readFile(id).then(res => ctx.setAssetSource(jpeg, res));

        return {
            avif: avif.id,
            webp: webp.id,
            jpeg: jpeg
        };
    }

    static async loadAsync(ctx, id) {
        return {
            avif: await ImgLoader.#image(ImgLoader.#emit(ctx, id, 'avif')),
            webp: await ImgLoader.#image(ImgLoader.#emit(ctx, id, 'webp')),
            jpeg: ctx.emitFile({
                type: 'asset',
                name: basename(id),
                source: await readFile(id)
            })
        };
    }

    static async #emitAsset(ctx, id, format) {
        const base = basename(id, extname(id));
        const fileName = `${base}.${format}`;

        const data = await Sharp.convert(id, format);

        return ctx.emitFile({
            type: 'asset',
            name: fileName,
            source: data
        });
    }

    static async #image(emitted) {
        await emitted.task;
        return emitted.id;
    }

    static #emit(ctx, id, format) {
        const base = basename(id, extname(id));
        const fileName = `${base}.${format}`;

        const file = ctx.emitFile({
            type: 'asset',
            name: fileName
        });

        const task = Sharp.convert(id, format)
            .then(res => ctx.setAssetSource(file, res));

        return {
            id: file,
            task
        };
    }
}