const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '../src/data/articles.ts');
let c = fs.readFileSync(p, 'utf8');

c = c.replace('restricts input cells to verified items', 'restricts input cells to approved items');
c = c.replace('learn <a href="/articles/how-to-add-bullet-points-in-excel"', 'review <a href="/articles/how-to-add-bullet-points-in-excel"');
c = c.replace('Furthermore, massive file uploads', 'In addition, massive file uploads');
c = c.replace('as detailed in our guide on <a href="/articles/windows-11-pro-vs-home"', 'as detailed in our analysis of <a href="/articles/windows-11-pro-vs-home"');
c = c.replace('When assembling comprehensive workbooks', 'When assembling complex workbooks');

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed buzzwords!');
