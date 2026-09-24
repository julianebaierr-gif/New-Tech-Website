const https = require('https');

https.get('https://api.github.com/repos/julianebaierr-gif/New-Tech-Website/actions/runs?per_page=1', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const latestRun = json.workflow_runs?.[0];
      if (!latestRun) {
        console.log('No runs found');
        return;
      }
      console.log(`Latest Run: ${latestRun.name} (ID: ${latestRun.id})`);
      console.log(`Status: ${latestRun.status} | Conclusion: ${latestRun.conclusion}`);
      
      https.get(`https://api.github.com/repos/julianebaierr-gif/New-Tech-Website/actions/runs/${latestRun.id}/jobs`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }, (jobRes) => {
        let jobData = '';
        jobRes.on('data', c => jobData += c);
        jobRes.on('end', () => {
          const jobJson = JSON.parse(jobData);
          jobJson.jobs?.forEach(j => {
            console.log(`Job: ${j.name} | Status: ${j.status} | Conclusion: ${j.conclusion}`);
            j.steps?.forEach(s => {
              console.log(`  Step: ${s.name} [${s.conclusion || s.status}]`);
            });
          });
        });
      });
    } catch (e) {
      console.log('Error:', e.message);
    }
  });
});
