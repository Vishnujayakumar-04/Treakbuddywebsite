const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'Data Collection');
const outDir = path.join(__dirname, 'src', 'data');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const map = {
    'Hotels.xlsx': 'hotels.json',
    'Restraunts.xlsx': 'restaurants.json',
    'Pubs & Bars.xlsx': 'pubs.json',
    'AdventureActivities.xlsx': 'adventure.json',
    'Temples.xlsx': 'temples.json',
    'Sos.xlsx': 'emergency.json',
    'Nature.xlsx': 'nature.json',
    'Beaches.xlsx': 'beaches.json'
};

for (const [inName, outName] of Object.entries(map)) {
    const inPath = path.join(dataDir, inName);
    const outPath = path.join(outDir, outName);
    if (!fs.existsSync(inPath)) {
        console.warn('Missing file:', inPath);
        fs.writeFileSync(outPath, '[]');
        continue;
    }
    const wb = xlsx.readFile(inPath);
    const sn = wb.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(wb.Sheets[sn]);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log(`Created ${outName}`);
}
