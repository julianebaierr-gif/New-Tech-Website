const https = require('https');

https.get('https://api.github.com/repos/julianebaierr-gif/New-Tech-Website/actions/runs?per_page=5', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.workflow_runs) {
        console.log(`Total runs found: ${json.total_count}`);
        json.workflow_runs.slice(0, 5).forEach((r, idx) => {
          console.log(`[${idx+1}] Workflow: ${r.name}`);
          console.log(`    Status: ${r.status} | Conclusion: ${r.conclusion}`);
          console.log(`    Triggered at: ${r.created_at}`);
          console.log(`    HTML URL: ${r.html_url}`);
          console.log('');
        });
      } else {
        console.log('GitHub API message:', json.message || data);
      }
    } catch (e) {
      console.log('Parse error:', e.message);
    }
  });
}).on('error', err => console.error('Request error:', err.message));
