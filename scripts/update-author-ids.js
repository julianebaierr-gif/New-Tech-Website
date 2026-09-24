const fs = require('fs');

let content = fs.readFileSync('src/data/articles.ts', 'utf8');
content = content.replace(/"marcus-vance"/g, '"evan-mitchell"');
content = content.replace(/"elena-rostova"/g, '"sarah-blake"');
fs.writeFileSync('src/data/articles.ts', content, 'utf8');

console.log('Successfully updated author IDs in src/data/articles.ts');
