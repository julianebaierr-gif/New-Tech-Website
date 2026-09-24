const crypto = require('crypto');
const fs = require('fs');

const key = crypto.randomBytes(16).toString('hex');
console.log('Generated IndexNow Key:', key);

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/' + key + '.txt', key, 'utf8');
console.log('Created public/' + key + '.txt');

const config = {
  key: key,
  keyLocation: 'https://techopswire.com/' + key + '.txt',
  host: 'techopswire.com'
};

fs.writeFileSync('src/lib/indexnow-config.json', JSON.stringify(config, null, 2), 'utf8');
console.log('Saved src/lib/indexnow-config.json');
