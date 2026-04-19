import fs from 'fs';
import path from 'path';

let missing = [];

try {
    const cats = fs.readFileSync('./src/data/categories.ts', 'utf-8');
    const reqs1 = [...cats.matchAll(/require\('([^']+)'\)/g)].map(m => m[1]);

    const places = fs.readFileSync('./src/data/places.ts', 'utf-8');
    const reqs2 = [...places.matchAll(/require\('([^']+)'\)/g)].map(m => m[1]);

    const allReqs = [...new Set([...reqs1, ...reqs2])];

    for (let r of allReqs) {
        const p = path.resolve('./src/data', r);
        if (!fs.existsSync(p)) {
            missing.push(r);
        }
    }

    if (missing.length) {
        console.log('MISSING FILES:', missing);
    } else {
        console.log('All local image references are valid!');
    }
} catch (e) {
    console.error(e);
}
