const https = require('https');

// Candidate Unsplash IDs for young professional headshots (under 35):
// Men:
// photo-1507003211169-0a1dd7228f2d (popular clean headshot)
// photo-1500648767791-00dcc994a43e (friendly young male professional)
// photo-1539571696357-5a69c17a67c6 (young guy portrait)
// photo-1519085360753-af0119f7cbe7 (young male professional executive)
// photo-1492562080023-ab3db95bfbce (young man headshot)
// photo-1506794778202-cad84cf45f1d (young man portrait)

// Women:
// photo-1534528741775-53994a69daeb (professional young woman)
// photo-1573496359142-b8d87734a5a2 (young female data analyst / professional in office)
// photo-1580894732444-8ecded7900cd (young female tech engineer working / portrait)
// photo-1573497019940-1c28c88b4f3e (young business female headshot)
// photo-1567532939604-b6b5b0db2604 (young female professional smiling)

const candidates = [
  // Male under 35 candidates
  { id: "photo-1500648767791-00dcc994a43e", name: "Evan candidate 1" },
  { id: "photo-1519085360753-af0119f7cbe7", name: "Evan candidate 2" },
  { id: "photo-1507003211169-0a1dd7228f2d", name: "Evan candidate 3" },
  { id: "photo-1492562080023-ab3db95bfbce", name: "Evan candidate 4" },
  // Female under 35 candidates
  { id: "photo-1573496359142-b8d87734a5a2", name: "Sarah candidate 1" },
  { id: "photo-1573497019940-1c28c88b4f3e", name: "Sarah candidate 2" },
  { id: "photo-1580894732444-8ecded7900cd", name: "Sarah candidate 3" },
  { id: "photo-1567532939604-b6b5b0db2604", name: "Sarah candidate 4" }
];

async function checkUrl(cand) {
  const url = `https://images.unsplash.com/${cand.id}?auto=format&fit=crop&w=400&h=400&q=80`;
  return new Promise(resolve => {
    https.get(url, res => {
      console.log(`[${cand.name}] ID: ${cand.id} -> Status: ${res.statusCode} (content-type: ${res.headers['content-type']})`);
      resolve({ ...cand, statusCode: res.statusCode, url });
    }).on('error', e => {
      console.log(`[${cand.name}] Error:`, e.message);
      resolve({ ...cand, statusCode: 500 });
    });
  });
}

async function run() {
  for (const c of candidates) {
    await checkUrl(c);
  }
}

run();
