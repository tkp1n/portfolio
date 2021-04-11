import fs from 'fs';
import path from 'path';
import util from 'util';
import FS from "./fsUtils";

const sharp = require('sharp');
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const cache = {};

export default class Sharp {
    static async init() {
        const cacheDir =  path.resolve(process.cwd(), '.cache');

        if (!fs.existsSync(cacheDir)) {
            await mkdir(cacheDir);
        }

        for (const fileName of await FS.listFiles(cacheDir)) {
            const key = path.basename(fileName);

            cache[key] = () => readFile(path.resolve(cacheDir, fileName));
        }
    }

    static async convert(fileName, format) {
        const key = path.basename(fileName, path.extname(fileName)) + '.' + format;

        const cached = cache[key];
        if (!!cached) {
            return await cached();
        }

        const result = await sharp(fileName)
            .toFormat(format)
            .toBuffer();

        const cacheDir =  path.resolve(process.cwd(), '.cache');
        await writeFile(path.resolve(cacheDir, key), result);

        cache[key] = () => Promise.resolve(result);

        return result;
    }
}