const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

// Match secondaryImage and tertiaryImage objects
const regex = /"secondaryImage"|secondaryImage:\s*\{[\s\S]*?"?alt"?:\s*"([^"]+)",[\s\S]*?"?caption"?:\s*"([^"]+)"[\s\S]*?\},[\s\S]*?"tertiaryImage"|tertiaryImage:\s*\{[\s\S]*?"?alt"?:\s*"([^"]+)",[\s\S]*?"?caption"?:\s*"([^"]+)"[\s\S]*?\}/g;

// Let's do it cleanly by evaluating or splitting
const parts = content.split(/\{\s*slug:\s*"/g).slice(1);
console.log(`Auditing images for ${parts.length} articles:\n`);

parts.forEach((p, idx) => {
  const slug = (p.match(/^([^"]+)"/) || [])[1];
  const secAlt = (p.match(/secondaryImage:\s*\{[\s\S]*?"alt":\s*"([^"]+)"/) || p.match(/secondaryImage:\s*\{[\s\S]*?alt:\s*"([^"]+)"/) || [])[1];
  const secCaption = (p.match(/secondaryImage:\s*\{[\s\S]*?"caption":\s*"([^"]+)"/) || p.match(/secondaryImage:\s*\{[\s\S]*?caption:\s*"([^"]+)"/) || [])[1];
  const terAlt = (p.match(/tertiaryImage:\s*\{[\s\S]*?"alt":\s*"([^"]+)"/) || p.match(/tertiaryImage:\s*\{[\s\S]*?alt:\s*"([^"]+)"/) || [])[1];
  const terCaption = (p.match(/tertiaryImage:\s*\{[\s\S]*?"caption":\s*"([^"]+)"/) || p.match(/tertiaryImage:\s*\{[\s\S]*?caption:\s*"([^"]+)"/) || [])[1];
  
  console.log(`[#${idx+1}] ${slug}`);
  console.log(`  Secondary: ${secAlt ? 'OK' : 'MISSING'} -> "${secAlt}"`);
  console.log(`             Caption -> "${secCaption}"`);
  console.log(`  Tertiary:  ${terAlt ? 'OK' : 'MISSING'} -> "${terAlt}"`);
  console.log(`             Caption -> "${terCaption}"`);
  console.log('');
});
