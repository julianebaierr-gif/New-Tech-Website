const https = require('https');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';

function sendPost(payload) {
  const jsonStr = JSON.stringify(payload);
  console.log('Sending POST to Webhook with payload:', jsonStr);

  function makeRequest(url, method, body) {
    const u = new URL(url);
    const options = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
      }
    };

    const req = https.request(options, res => {
      console.log(`Response Status: ${res.statusCode}`);
      if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
        console.log(`Following redirect to: ${res.headers.location}`);
        // When Google Apps Script redirects after POST, follow with GET
        makeRequest(res.headers.location, 'GET', null);
        return;
      }
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        console.log('Response body:', resBody);
      });
    });

    req.on('error', err => console.error('Request error:', err));
    if (body) req.write(body);
    req.end();
  }

  makeRequest(webhookUrl, 'POST', jsonStr);
}

// Test with a sample or sync ping
sendPost({
  action: "test_ping",
  keyword: "test keyword",
  category: "Test Category",
  tags: "tag1, tag2",
  postUrl: "https://techopswire.com/articles/test",
  postDate: new Date().toISOString()
});
