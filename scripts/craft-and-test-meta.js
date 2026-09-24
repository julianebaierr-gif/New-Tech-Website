const pages = [
  // 1. Homepage
  {
    page: "Homepage (/)",
    title: "TechOps Wire | Practical Cloud & Systems Tutorials",
    desc: "Tested practical manuals, cloud architecture comparisons, Linux commands, and Excel formulas written and tested by working technicians for IT operations."
  },

  // 2. About (/about)
  {
    page: "About (/about)",
    title: "About Our Team & System Testing Lab | TechOps Wire",
    desc: "Read about TechOps Wire, our team background, and why we test each spreadsheet formula, cloud configuration, and operating system tutorial on clean labs."
  },

  // 3. Editorial Policy (/editorial-policy)
  {
    page: "Editorial Policy (/editorial-policy)",
    title: "Editorial Policy & Testing Standards | TechOps Wire",
    desc: "Review our quality standards, hardware testing methods, command safety rules, and reader correction policies across all published operating tutorials."
  },

  // 4. Contact (/contact)
  {
    page: "Contact (/contact)",
    title: "Contact TechOps Wire Editorial Team | TechOps Wire",
    desc: "Contact TechOps Wire editors for factual corrections, user feedback, tutorial ideas, and infrastructure questions. Our team responds within two work days."
  },

  // 5. Privacy Policy (/privacy)
  {
    page: "Privacy Policy (/privacy)",
    title: "TechOps Wire Privacy & Cookie Policy | TechOps Wire",
    desc: "Review the TechOps Wire privacy policy regarding data collection, cookie usage, reader analytics, and our strict commitment to visitor privacy protection."
  },

  // 6. Terms of Service (/terms)
  {
    page: "Terms of Service (/terms)",
    title: "Terms of Service & Reader Agreement | TechOps Wire",
    desc: "Read our terms of service, acceptable use rules, and licensing policies for code snippets, configuration files, and software tutorials on this website."
  },

  // 7. Categories
  {
    page: "Category: Data & Excel (/category/data-excel-automation)",
    title: "Excel Formulas & Data Cleaning Steps | TechOps Wire",
    desc: "Browse practical Excel tutorials, dynamic array formulas, drop-down validation menus, and reliable spreadsheet data cleaning steps tested by specialists."
  },
  {
    page: "Category: Cloud & Infrastructure (/category/cloud-infrastructure)",
    title: "Cloud Infrastructure & Linux Setups | TechOps Wire",
    desc: "Browse hands-on Linux administration tutorials, AWS EC2 compute sizing roadmaps, and Docker container networking setups tested on live server deployments."
  },
  {
    page: "Category: AI & Developer Tools (/category/ai-developer-tools)",
    title: "AI Developer Tools & API Token Specs | TechOps Wire",
    desc: "Practical developer references covering large language model token contexts, file upload constraints, API response speeds, and production AI utilities."
  },
  {
    page: "Category: OS & Systems (/category/os-systems)",
    title: "Operating Systems & Server Migration | TechOps Wire",
    desc: "Practical operating system manuals covering Windows 11 settings, Linux octal permissions, and structured Windows Server upgrade and migration roadmaps."
  },

  // 8. Authors
  {
    page: "Author: Sarah Blake (/authors/sarah-blake)",
    title: "Sarah Blake | Excel & Data Operations | TechOps Wire",
    desc: "Sarah Blake is a data operations analyst with 3+ years designing automated reporting workbooks, dynamic financial models, and clean spreadsheet workflows."
  },
  {
    page: "Author: Evan Mitchell (/authors/evan-mitchell)",
    title: "Evan Mitchell | Cloud Systems Admin | TechOps Wire",
    desc: "Evan Mitchell is a cloud systems administrator with 3+ years configuring Linux clusters, AWS EC2 instances, and Docker containers in enterprise networks."
  },

  // 9. Articles (All 9)
  {
    slug: "how-to-remove-duplicates-in-excel",
    title: "Remove Duplicates in Excel Step-by-Step | TechOps Wire",
    desc: "Remove duplicate rows in Excel using conditional formatting highlights, the native Remove Duplicates tool, or dynamic UNIQUE formulas without losing data."
  },
  {
    slug: "aws-ec2-instance-types-explained",
    title: "AWS EC2 Instance Types & Sizing Steps | TechOps Wire",
    desc: "Compare AWS EC2 instance types across general purpose, compute optimized, and memory families to choose the right virtual machine sizing for your workload."
  },
  {
    slug: "why-is-chatgpt-so-slow",
    title: "Why Is ChatGPT So Slow? Causes & Fixes | TechOps Wire",
    desc: "Fix slow ChatGPT response speeds with practical adjustments. Review why token generation lags during peak hours and how to bypass interface bottlenecks."
  },
  {
    slug: "windows-11-pro-vs-home",
    title: "Windows 11 Pro vs Home Edition Review | TechOps Wire",
    desc: "Compare Windows 11 Pro and Home editions. Review BitLocker encryption, Remote Desktop host features, Hyper-V virtualization, and enterprise security tools."
  },
  {
    slug: "linux-file-permissions-chmod-chown",
    title: "Linux chmod & chown Permissions Steps | TechOps Wire",
    desc: "Understand Linux permissions with chmod and chown commands. Inspect octal modes like 755 and 644, user groups, and safe file security without chmod 777."
  },
  {
    slug: "excel-drop-down-list",
    title: "How to Create Drop-Down Lists in Excel | TechOps Wire",
    desc: "Create dynamic drop-down lists in Excel with data validation. Step-by-step tutorial covering auto-expanding lists, dependent menus, and error alert setups."
  },
  {
    slug: "docker-container-architecture",
    title: "Docker Container Architecture Steps | TechOps Wire",
    desc: "Understand Docker container architecture including images, persistent storage volumes, and bridge networks on Linux systems with practical command lines."
  },
  {
    slug: "chatgpt-file-upload-limits",
    title: "ChatGPT File Upload Limits & Formats | TechOps Wire",
    desc: "Review file upload limits in ChatGPT Plus. Check file size caps, token context window boundaries, and practical methods for processing large spreadsheets."
  },
  {
    slug: "windows-server-2019-end-of-life",
    title: "Windows Server 2019 End of Life Roadmap | TechOps Wire",
    desc: "Prepare for Windows Server 2019 end of support with this upgrade roadmap. Master in-place upgrade steps, side-by-side VM migrations, and backup readiness."
  }
];

let allPassed = true;
pages.forEach((p, idx) => {
  const tLen = p.title.length;
  const dLen = p.desc.length;
  const tOk = tLen >= 50 && tLen <= 55;
  const dOk = dLen >= 150 && dLen <= 155;

  if (!tOk || !dOk) allPassed = false;

  console.log(`[${idx+1}] ${p.page || p.slug}`);
  console.log(`  Title: (${tLen} chars) [${tOk ? 'PASS' : 'FAIL'}]: "${p.title}"`);
  console.log(`  Desc:  (${dLen} chars) [${dOk ? 'PASS' : 'FAIL'}]: "${p.desc}"`);
  console.log('');
});

console.log(`========================================`);
console.log(`Overall Pass (All 50-55 and 150-155): ${allPassed}`);
console.log(`========================================`);

const bannedList = [
  'A deep dive into', 'A Guide to', 'Adopt', 'Adopting', 'An in-depth look at',
  'An in-depth look into', 'As we look ahead', 'Battle-tested', 'Beacon',
  'Bulletproof', 'Complete', 'Comprehensive', 'Comprehensive Guide',
  'Comprehensive Guide to', 'Consumption', 'Cornerstone', 'Crucial',
  'Crucial component', 'Deep dive', 'Delve', 'Delve into', 'Delving',
  'Demystifying', 'Digital', 'Discover', 'Discover verified facts', 'Dive into',
  'Elevate', 'Embark', 'Enterprise-grade', 'Evolution', 'Explore', 'Extracting',
  'Find', 'Find verified facts', 'Foster', 'Furthermore', 'Game-changer', 'Guide',
  'Harness', 'Helpful background', 'Helpful background details and common queries',
  'High-Fidelity', 'In conclusion', 'In this article', 'In this article, we explore',
  'In today\'s digital era', 'In today\'s fast-paced', 'In today\'s fast-paced digital world',
  'In-depth', 'It is crucial to', 'It is important to note', 'It is important to remember',
  'Key Insights', 'Landscape', 'Learn', 'Learn how', 'Learn more', 'Learn more details',
  'Learn more now', 'Learn more today', 'Leverage', 'Look no further', 'Media',
  'Modern', 'Modern teams adopting', 'Moreover', 'Navigating', 'Navigating the',
  'Orchestrate', 'Paradigm shift', 'Pipelines', 'Pivotal', 'Plethora', 'Powerhouse',
  'Realm', 'Robust', 'Seamless', 'Seamlessly', 'Tapestry', 'Technical', 'Testament',
  'The Ultimate', 'Ultimate', 'Ultimate Guide', 'Ultra-High', 'Uncover', 'Unleash',
  'Unlock', 'Unpacking', 'Verified', 'Vital', 'Vital role'
];

let bannedMatches = [];
pages.forEach((p, idx) => {
  const combined = `${p.title} ${p.desc}`;
  bannedList.forEach(term => {
    const isPhrase = term.includes(' ');
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = isPhrase ? new RegExp(escaped, 'gi') : new RegExp('\\b' + escaped + '\\b', 'gi');
    if (regex.test(combined)) {
      bannedMatches.push({ page: p.page || p.slug, term });
    }
  });
});

console.log(`Banned words found in crafted metadata: ${bannedMatches.length}`);
