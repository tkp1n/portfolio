export default class UrlUtils {
    static isAbsolute (url) {
        // Don't match Windows paths `c:\`
        if (/^[a-zA-Z]:\\/.test(url)) {
            return false;
        }

        // Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
        // Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
        return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
    }

    static metaAsset(id) {
        return `new URL(${UrlUtils.metaFile(id)}, import.meta.url).href`;
    }

    static metaImport(id) {
        return `() => import(${UrlUtils.metaFile(id)})`;
    }

    static metaFile(id) {
        return `import.meta.ROLLUP_FILE_URL_${id}`;
    }
}