const XLSX = require('./node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'Data Collection');
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.xlsx'));

const allData = {};

for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const wb = XLSX.readFile(filePath);
    const category = file.replace('.xlsx', '');
    allData[category] = {};

    for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        allData[category][sheetName] = rows;
    }
}

fs.writeFileSync(
    path.join(__dirname, 'excel_data_dump.json'),
    JSON.stringify(allData, null, 2)
);

// Print summary
for (const [file, sheets] of Object.entries(allData)) {
    console.log(`\n=== ${file} ===`);
    for (const [sheet, rows] of Object.entries(sheets)) {
        console.log(`  Sheet: "${sheet}" — ${rows.length} rows`);
        if (rows.length > 0) {
            console.log(`  Columns: ${Object.keys(rows[0]).join(', ')}`);
            rows.forEach((row, i) => {
                const name = row['Name'] || row['name'] || row['Place Name'] || row['PLACE NAME'] || row['Hotel Name'] || row['Restaurant Name'] || row['Temple Name'] || row['Beach Name'] || JSON.stringify(row).slice(0, 60);
                console.log(`    [${i + 1}] ${name}`);
            });
        }
    }
}
console.log('\n✅ Full data written to excel_data_dump.json');
