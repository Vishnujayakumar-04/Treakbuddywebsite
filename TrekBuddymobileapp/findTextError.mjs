import fs from 'fs';
import path from 'path';

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(/>\s*([^<{]+)\s*</g);
        if (matches) {
            for (const match of matches) {
                let text = match.replace(/>/g, '').replace(/</g, '').trim();
                // Skip common false positives
                if (
                    text.length > 0 &&
                    !text.startsWith('{') &&
                    !text.endsWith('}') &&
                    !text.includes('/*') &&
                    !text.includes('*/') &&
                    !text.includes('//')
                ) {
                    console.log(`[${path.basename(filePath)}:${i + 1}] ${text}`);
                    found = true;
                }
            }
        }
    }
}

const screensDir = './src/screens';
fs.readdirSync(screensDir).forEach(file => {
    if (file.endsWith('.tsx')) {
        checkFile(path.join(screensDir, file));
    }
});
