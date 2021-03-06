const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

fs.rmdirSync(path.resolve(cwd, '.cache'),{recursive: true});

const pub = path.resolve(cwd, 'public');
fs.readdirSync(pub).forEach(file => {
    const fullPath = path.resolve(pub, file);

    if (fs.statSync(fullPath).isDirectory()) {
        fs.rmdirSync(fullPath, {recursive: true});
    }
    else if (!file.endsWith('index.html') && !file.endsWith('robots.txt'))
    {
        fs.rmSync(fullPath);
    }
});