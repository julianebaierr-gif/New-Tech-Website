const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/authors');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const authors = [
  {
    name: 'evan-mitchell',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    file: 'evan-mitchell.jpg'
  },
  {
    name: 'sarah-blake',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    file: 'sarah-blake.jpg'
  }
];

function download(item) {
  return new Promise(resolve => {
    const filePath = path.join(dir, item.file);
    const file = fs.createWriteStream(filePath);
    https.get(item.url, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved ${item.file}`);
        resolve();
      });
    }).on('error', err => {
      console.error(err);
      resolve();
    });
  });
}

async function run() {
  for (const a of authors) await download(a);
  console.log('Finished downloading portraits.');
}

run();
