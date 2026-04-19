const fs = require('fs');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const parser = require('@babel/parser');

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let ast;
    try {
        ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
    } catch (e) {
        return;
    }

    traverse(ast, {
        JSXText(path) {
            if (path.node.value) {
                const text = path.node.value.replace(/[\n\r\t ]+/g, '').trim();
                if (text.length > 0) {
                    let isTextParent = false;
                    let p = path.parentPath;
                    while (p && p.node && p.node.type === 'JSXElement') {
                        const nameObj = p.node.openingElement.name;
                        const name = nameObj.name || (nameObj.object && nameObj.object.name + '.' + nameObj.property.name);
                        if (name === 'Text' || name === 'Animated.Text' || name === 'Button' || name === 'AutoAwesomeIcon' || name === 'ChevronRightIcon' || name === 'LinearGradient') {
                            isTextParent = true;
                            break;
                        }
                        p = p.parentPath;
                    }
                    if (!isTextParent) {
                        console.log('STRAY TEXT IN ' + filePath + ' line ' + path.node.loc.start.line + ': ' + text);
                    }
                }
            }
        },
        JSXExpressionContainer(path) {
            if (path.node.expression.type === 'StringLiteral') {
                let isTextParent = false;
                let p = path.parentPath;
                while (p && p.node && p.node.type === 'JSXElement') {
                    const nameObj = p.node.openingElement.name;
                    const name = nameObj.name || (nameObj.object && nameObj.object.name + '.' + nameObj.property.name);
                    if (name === 'Text' || name === 'Animated.Text') {
                        isTextParent = true;
                        break;
                    }
                    p = p.parentPath;
                }
                if (!isTextParent) {
                    // It might be a prop like <View testID={"string"} />
                    if (path.parentPath.node.type !== 'JSXAttribute') {
                        console.log('STRAY EXPRESSION IN ' + filePath + ' line ' + path.node.loc.start.line + ': ' + path.node.expression.value);
                    }
                }
            }
        }
    });
}

const dirs = ['./src/screens', './src/components', './App.tsx', './src/navigation/StackNavigator.tsx'];
for (const d of dirs) {
    if (d.endsWith('.tsx')) { checkFile(d); continue; }
    fs.readdirSync(d).forEach(f => {
        if (f.endsWith('.tsx')) {
            checkFile(d + '/' + f);
        }
    });
}
