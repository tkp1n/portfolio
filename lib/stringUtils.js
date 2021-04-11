export default class StringUtils {
    static escapeTmpl(strings, ...values) {
        let str = '';
        strings.forEach((string, i) => {
            str += string + StringUtils.escapeSingleTemplateLiteral(values[i] || '');
        });
        return str;
    }

    static escapeStr(strings, ...values) {
        let str = '';
        strings.forEach((string, i) => {
            str += string + StringUtils.escapeSingle(values[i] || '');
        });
        return str;
    }

    static escapeSingleTemplateLiteral(string) {
        return ('' + string)
            .replace(/`/g, '\\`')
            .replace(/\${/g, '\\${');
    }

    static escapeSingle(string) {
        return ('' + string)
            .replace(/["'\\`\n\r\u2028\u2029]/g, function (character) {
            // Escape all characters not included in SingleStringCharacters and
            // DoubleStringCharacters on
            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
            switch (character) {
                case '"':
                case "'":
                case '\\':
                    return '\\' + character
                // Four possible LineTerminator characters need to be escaped:
                case '\n':
                    return '\\n'
                case '\r':
                    return '\\r'
                case '\u2028':
                    return '\\u2028'
                case '\u2029':
                    return '\\u2029'
            }
        });
    }
}