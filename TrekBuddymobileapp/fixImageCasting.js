const fs = require('fs');

function checkFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Let's replace naive { uri: item.image } castings or similar
    const pattern1 = /source=\{\{\s*uri:\s*([^}\s|]+)\s*(\|\|[^}]*)?\}\}/g;

    content = content.replace(pattern1, (match, p1, p2) => {
        // If it's already using a ternary, skip
        if (match.includes('typeof')) return match;

        // We want to handle `source={{ uri: item.image || 'fallback' }}`
        // p1 = `item.image`
        // p2 = `|| 'fallback'` (optional)

        changed = true;
        let fallbackPart = p2 ? p2 : '';

        // The safe transform is:  typeof P1 === 'number' ? P1 : { uri: P1 fallbackPart }
        if (fallbackPart) {
            return `source={typeof ${p1} === 'number' ? ${p1} : { uri: ${p1} ${fallbackPart} }}`;
        } else {
            return `source={typeof ${p1} === 'number' ? ${p1} : { uri: ${p1} }}`;
        }
    });

    const pattern2 = /source=\{\{\s*uri:\s*([^}\s]+)\s*\}\}/g;
    content = content.replace(pattern2, (match, p1) => {
        if (match.includes('typeof') || match.includes('||')) return match;
        changed = true;
        return `source={typeof ${p1} === 'number' ? ${p1} : { uri: ${p1} }}`;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated images in: ${filePath}`);
    }
}

const dirs = ['./src/screens', './src/components'];
for (const d of dirs) {
    if (d.endsWith('.tsx')) { checkFile(d); continue; }
    if (!fs.existsSync(d)) continue;
    fs.readdirSync(d).forEach(f => {
        if (f.endsWith('.tsx')) {
            checkFile(d + '/' + f);
        }
    });
}

// Extra directories
checkFile('./src/navigation/TabNavigator.tsx');
if (fs.existsSync('./src/components/ui/index.tsx')) {
    checkFile('./src/components/ui/index.tsx');
}
