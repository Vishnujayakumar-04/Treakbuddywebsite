
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const DATA_DIR = "d:\\TrekBuddy\\assets\\Data Collection";
const OUTPUT_FILE = "d:\\TrekBuddy\\website\\src\\data\\puducherry_data.json";

function main() {
    console.log("Starting data import script...");

    if (!fs.existsSync(DATA_DIR)) {
        console.error(`Directory not found: ${DATA_DIR}`);
        return;
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.toLowerCase().endsWith('.xlsx'));
    const allData = {};

    console.log(`Found ${files.length} Excel files in ${DATA_DIR}`);

    files.forEach(file => {
        const filePath = path.join(DATA_DIR, file);
        const categoryName = path.basename(file, '.xlsx'); // e.g., "AdventureActivities"

        try {
            console.log(`Processing: ${file}...`);
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const data = xlsx.utils.sheet_to_json(sheet);

            if (data.length > 0) {
                allData[categoryName] = data;
                console.log(`  -> Loaded ${data.length} entries for ${categoryName}`);
            } else {
                console.log(`  -> Warning: No data found in ${file}`);
            }

        } catch (err) {
            console.error(`  -> Error reading ${file}:`, err);
        }
    });

    // Write to JSON file
    // Ensure directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
    console.log(`\nSuccessfully compiled all data into: ${OUTPUT_FILE}`);
}

main();
