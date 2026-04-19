import fs from 'fs';

const replacements = {
    'seaside guest house 2.jfif': 'ocean spray 2.jfif',
    'seaside guest house 3.jfif': 'ocean spray 3.jfif',
    'seaside guest house.jfif': 'ocean spray.jfif',
    'club mahindra 2.jfif': 'le pondy 2.jfif',
    'club mahindra 3.jfif': 'le pondy 3.jfif',
    'club mahindra.jfif': 'le pondy.jfif',
    'serene beach.jpeg': 'serenity beach.jpg',
    'temple.jfif': 'aayi mandapam 2.jfif',
    'la maison charu.webp': 'La-Maison-Charu.webp',
    'le pondy 2.jfif': 'le pondy 2.jfif',
    'le pondy 3.jfif': 'le pondy 3.jfif',
    'le pondy.jfif': 'le pondy.jfif',
    'ocean spray.jfif': 'ocean spray.jfif',
    'ocean spray 2.jfif': 'ocean spray 2.jfif',
    'ocean spray 3.jfif': 'ocean spray 3.jfif'
};

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf-8');
    for (const [bad, good] of Object.entries(replacements)) {
        content = content.replace(new RegExp(bad.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), good);
    }
    content = content.replace(/la maison charu\.webp/gi, 'La-Maison-Charu.webp');
    fs.writeFileSync(file, content);
}

fixFile('./src/data/categories.ts');
fixFile('./src/data/places.ts');
fixFile('./src/screens/FamousPlacesScreen.tsx');
console.log('Fixed broken images in all files!');