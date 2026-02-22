
const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash Image IDs relevant to Pondicherry
const IMAGES = {
    'b1': [ // Promenade Beach - known good + new
        'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=1600&q=80',
        'https://images.unsplash.com/photo-1621517720977-ce9d53da3657?w=1600&q=80',
        'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1600&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80'
    ],
    't1': [ // Manakula Vinayagar - using temple/indian architecture
        'https://images.unsplash.com/photo-1582443168850-6e1ea092647b?w=1600&q=80',
        'https://images.unsplash.com/photo-1628670271383-29a35607973d?w=1600&q=80',
        'https://images.unsplash.com/photo-1561081682-965306634739?w=1600&q=80',
        'https://images.unsplash.com/photo-1606216954209-646dc7550e56?w=1600&q=80',
        'https://images.unsplash.com/photo-1596711684365-1779956bd448?w=1600&q=80'
    ],
    's3': [ // Auroville / Matrimandir - Corrected IDs
        'https://images.unsplash.com/photo-1623083984360-15bd8434cc85?w=1600&q=80',
        'https://images.unsplash.com/photo-1623835606828-09553e77c8e3?w=1600&q=80',
        'https://images.unsplash.com/photo-1596707328604-faed4c53574c?w=1600&q=80',
        'https://images.unsplash.com/photo-1518134253900-5034c5147854?w=1600&q=80',
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&q=80'
    ],
    'h1': [ // Heritage
        'https://images.unsplash.com/photo-1596711684365-1779956bd448?w=1600&q=80',
        'https://images.unsplash.com/photo-1582255655519-7b3b6f0430f8?w=1600&q=80',
        'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=1600&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600&q=80',
        'https://images.unsplash.com/photo-1619623725615-512c1b483e0c?w=1600&q=80'
    ]
};

const BASE_DIR = "d:\\TrekBuddy\\website\\public\\images\\places";

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        https.get(url, options, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
            } else if (response.statusCode === 302 || response.statusCode === 301) {
                downloadImage(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                fs.unlink(dest, () => { });
                reject(`Server responded with ${response.statusCode}: ${url}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
}

async function main() {
    console.log("Starting image download...");

    for (const [id, urls] of Object.entries(IMAGES)) {
        const placeDir = path.join(BASE_DIR, id);
        if (!fs.existsSync(placeDir)) {
            fs.mkdirSync(placeDir, { recursive: true });
        }

        console.log(`Processing ${id}...`);
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const ext = '.jpg';
            const filename = `${i + 1}${ext}`; // 1.jpg, 2.jpg
            const dest = path.join(placeDir, filename);

            if (fs.existsSync(dest)) {
                const stats = fs.statSync(dest);
                if (stats.size > 1000) {
                    console.log(`  - Skipping ${filename} (exists)`);
                    continue;
                }
            }

            try {
                process.stdout.write(`  - Downloading ${filename}... `);
                await downloadImage(url, dest);
                console.log("Done");
            } catch (err) {
                console.log(`Error: ${err}`);
            }
        }
    }
    console.log("All downloads complete!");
}

main();
