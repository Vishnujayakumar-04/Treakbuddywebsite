import fs from 'fs';
import path from 'path';

// Read the website places.ts
let webPlacesTs = fs.readFileSync('D:/TrekBuddywebsite/src/services/data/places.ts', 'utf-8');

// The mobile app places.ts mapping
// We want to just extract the `const MANUAL_PLACES` array and inject it into the mobile places.ts.

const startStr = 'const MANUAL_PLACES: Place[] = [';
const endStr = '];\n\n\nimport hotelsData'; // Let's just find the end of the array by searching for '];' immediately followed by blank lines

const startIdx = webPlacesTs.indexOf(startStr);
const endIdx2 = webPlacesTs.indexOf('import hotelsData', startIdx);
if (startIdx === -1 || endIdx2 === -1) {
    console.log("Failed. startIdx", startIdx, "endIdx2", endIdx2);
    process.exit(1);
}

const endBracketIdx = webPlacesTs.lastIndexOf(']', endIdx2);
let manualPlacesContent = webPlacesTs.substring(startIdx + startStr.length, endBracketIdx);

// Convert strings like: image: "/assets/beaches/paradise beach.jpeg"
// to: image: require('../../assets/web_assets/beaches/paradise beach.jpeg')
manualPlacesContent = manualPlacesContent.replace(/image:\s*"\/assets\/(.+?)"/g, "image: require('../../assets/web_assets/$1')");

// Fix b1 specific issues
manualPlacesContent = manualPlacesContent.replace(/image: "\/images\/places\/b1\/1\.jpg"/g, "image: require('../../assets/web_assets/beaches/promenade beach.jpg')");

// For gallery array paths like "/images/places/b1/..." we will leave them or replace them with a dummy if they error.
// The mobile app currently doesn't use gallery from MANUAL_PLACES (they don't have detail pages with galleries yet)
manualPlacesContent = manualPlacesContent.replace(/"\/images\/places\/.+?"/g, "''");

// Now we need to read the mobile app's current places.ts and replace its MANUAL_PLACES block.
let mobilePlacesTs = fs.readFileSync('./src/data/places.ts', 'utf-8');
const mobilePlacesRegex = /const MANUAL_PLACES: Place\[\] = \[([\s\S]*?)\];\n\n\n\/\/ --- JSON MAPPINGS ---/;

// If the mobile app doesn't have the exactly matching end block... 
// Wait, mobile app has `import hotelsData` right below it? No, mobile app doesn't import json right after MANUAL_PLACES.
// I will just replace from `const MANUAL_PLACES: Place[] = [` to `// --- JSON MAPPINGS ---`
// Let's just do an index replacement.
const startIndex = mobilePlacesTs.indexOf('const MANUAL_PLACES: Place[] = [');
const endIndex = mobilePlacesTs.indexOf('export const PLACES_DATA: Place[] = [', startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find start/end marks in mobile places.ts.");
    process.exit(1);
}

const finalMobileContent = mobilePlacesTs.substring(0, startIndex) +
    "const MANUAL_PLACES: Place[] = [\n" + manualPlacesContent + "];\n\n" +
    mobilePlacesTs.substring(endIndex);

fs.writeFileSync('./src/data/places.ts', finalMobileContent);
console.log('Successfully synced MANUAL_PLACES to mobile places.ts!');
