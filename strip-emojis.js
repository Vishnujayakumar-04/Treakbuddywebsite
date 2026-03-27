const fs = require('fs');
const path = require('path');

// Regex for wide range of emoticons and miscellaneous pictographs, but specifically avoiding basic ASCII
const emojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

function stripEmojis(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
                stripEmojis(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (emojiRegex.test(content)) {
                console.log(`Stripping emojis from: ${fullPath}`);
                const stripped = content.replace(emojiRegex, '');
                fs.writeFileSync(fullPath, stripped, 'utf8');
            }
        }
    }
}

stripEmojis(process.cwd() + '/src');
console.log('Done.');
