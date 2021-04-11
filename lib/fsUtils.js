import fs from 'fs';
import util from 'util';

const readdir = util.promisify(fs.readdir);

export default class FS {
    static async listFiles(baseDir) {
        const dirs = await readdir(baseDir, {withFileTypes: true});
        return dirs
            .filter(dirent => !dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    static async listSubdirectories(baseDir) {
        const dirs = await readdir(baseDir, {withFileTypes: true});
        return dirs
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }
}