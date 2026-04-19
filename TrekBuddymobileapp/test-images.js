const fs = require('fs');
const https = require('https');

async function searchImage(query) {
    return new Promise((resolve, reject) => {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' pondicherry image')}`;

        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Find image src in the HTML
                const match = data.match(/<img[^>]+src="([^">]+)"/);
                if (match && match[1]) {
                    // Duckduckgo hides real images, wait...
                }

                // Let's just use Wikipedia API
                resolve(data.substring(0, 500));
            });
        }).on('error', reject);
    });
}

const https2 = require('https');
async function searchWikiImage(query) {
    return new Promise((resolve, reject) => {
        // 1. Search for the Wikipedia page
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + " Puducherry")}&utf8=&format=json`;
        https2.get(searchUrl, { headers: { 'User-Agent': 'TrekBuddy/1.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.query.search.length > 0) {
                        const title = parsed.query.search[0].title;
                        // 2. Get the main image
                        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
                        https2.get(imgUrl, { headers: { 'User-Agent': 'TrekBuddy/1.0' } }, (res2) => {
                            let data2 = '';
                            res2.on('data', chunk => data2 += chunk);
                            res2.on('end', () => {
                                const parsed2 = JSON.parse(data2);
                                const pages = parsed2.query.pages;
                                const pageId = Object.keys(pages)[0];
                                if (pages[pageId].thumbnail) {
                                    resolve(pages[pageId].thumbnail.source);
                                } else {
                                    resolve(null);
                                }
                            });
                        });
                    } else {
                        resolve(null);
                    }
                } catch (e) { resolve(null); }
            });
        });
    });
}

async function run() {
    console.log("Wiki:", await searchWikiImage("Promenade Beach"));
    console.log("Wiki:", await searchWikiImage("Auroville"));
    console.log("Wiki:", await searchWikiImage("Botanical Garden"));
}
run();
