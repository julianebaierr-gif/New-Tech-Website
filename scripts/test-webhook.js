const https = require('https');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';

function testWebhook() {
  console.log('Testing Webhook URL with GET...');
  
  // Google Apps Script redirects with 302, so follow redirect
  function fetchUrl(url, method, payload, callback) {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: method,
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      } : {}
    };

    const req = https.request(options, res => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers:`, res.headers.location);
      if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
        console.log(`Following redirect to ${res.headers.location}...`);
        fetchUrl(res.headers.location, 'GET', null, callback);
        return;
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => callback(null, body));
    });

    req.on('error', err => callback(err));
    if (payload) req.write(payload);
    req.end();
  }

  fetchUrl(webhookUrl, 'GET', null, (err, body) => {
    if (err) console.error('Error:', err);
    else console.log('Response body:', body.slice(0, 500));
  });
}

testWebhook();
