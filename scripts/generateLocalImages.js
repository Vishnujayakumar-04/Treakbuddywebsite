const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');

let imageMap = {};

function scan(dir, cat) {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        if (f.isDirectory()) {
            scan(path.join(dir, f.name), f.name);
        } else {
            const ext = path.extname(f.name);
            const base = path.basename(f.name, ext).toLowerCase().trim();
            // Store by normalized string without spaces/numbers loosely
            const key = base.replace(/[\d\W_]+/g, '');
            if (!imageMap[key]) {
                imageMap[key] = [];
            }
            imageMap[key].push(`/assets/${cat ? cat + '/' : ''}${f.name}`);
        }
    }
}
scan(assetsDir, '');

fs.writeFileSync('src/services/data/localImages.ts', `export const LOCAL_IMAGES: Record<string, string[]> = ${JSON.stringify(imageMap, null, 2)};\n\nexport function resolveLocalImage(name: string, fallback: string): string {
    if (!name) return fallback;
    const key = name.toLowerCase().replace(/[\\d\\W_]+/g, '');
    for (const k in LOCAL_IMAGES) {
        // Simple subset match
        if (key.includes(k) || k.includes(key) && key.length > 3) {
            return LOCAL_IMAGES[k][0];
        }
    }
    return fallback;
}

export function resolveLocalGallery(name: string, fallback: string[]): string[] {
    if (!name) return fallback;
    const key = name.toLowerCase().replace(/[\\d\\W_]+/g, '');
    for (const k in LOCAL_IMAGES) {
        if (key.includes(k) || k.includes(key) && key.length > 3) {
            return LOCAL_IMAGES[k];
        }
    }
    return fallback;
}
`);
console.log('Created localImages.ts');
