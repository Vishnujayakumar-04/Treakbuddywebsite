const fs = require('fs');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    let ast;
    try {
        ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
    } catch (e) { return; }

    traverse(ast, {
        JSXOpeningElement(path) {
            const name = path.node.name.name || (path.node.name.object && path.node.name.object.name + '.' + path.node.name.property.name);
            if (name === 'Image' || name === 'Animated.Image') {
                const sourceAttr = path.node.attributes.find(a => a.name && a.name.name === 'source');
                if (sourceAttr && sourceAttr.value && sourceAttr.value.type === 'JSXExpressionContainer') {
                    const exp = sourceAttr.value.expression;
                    const code = content.substring(exp.start, exp.end);
                    console.log(`[${filePath}] source={${code}}`);
                }
            }
        }
    });
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

checkFile('./src/navigation/TabNavigator.tsx');
checkFile('./src/components/ui/index.tsx');

console.log("Analysis Complete.");
