const pages = [
  // 1. Homepage
  {
    name: "Homepage (/)",
    title: "TechOps Wire | Practical Cloud and Systems Tutorials",
    desc: "Tested practical manuals, cloud architecture comparisons, Linux commands, and Excel formulas written and tested by working technicians for IT operations."
  },
  // 2. About
  {
    name: "About (/about)",
    title: "About Our Tech Team and Lab Testing | TechOps Wire",
    desc: "Read about TechOps Wire, our team background, and why we test each spreadsheet formula, cloud configuration, and operating system tutorial on clean labs."
  },
  // 3. Editorial Policy
  {
    name: "Editorial Policy (/editorial-policy)",
    title: "Editorial Policy and Testing Standards | TechOps Wire",
    desc: "Review our quality standards, hardware testing methods, command safety rules, and reader correction policies across all published operating tutorials."
  },
  // 4. Contact
  {
    name: "Contact (/contact)",
    title: "Contact TechOps Wire Editorial Team | TechOps Wire",
    desc: "Contact TechOps Wire editors for factual corrections, user feedback, tutorial ideas, and infrastructure questions. Our team responds within two work days."
  },
  // 5. Privacy Policy
  {
    name: "Privacy Policy (/privacy)",
    title: "TechOps Wire Privacy and Cookie Policy | TechOps Wire",
    desc: "Review the TechOps Wire privacy policy regarding data collection, cookie usage, reader analytics, and our strict commitment to visitor privacy protection."
  },
  // 6. Terms of Service
  {
    name: "Terms of Service (/terms)",
    title: "Terms of Service and Reader Agreement | TechOps Wire",
    desc: "Read our terms of service, acceptable use rules, and licensing policies for code snippets, configuration files, and software tutorials on this website."
  },
  // 7. Categories
  {
    name: "Category: Data & Excel",
    title: "Excel Formulas and Data Cleaning Steps | TechOps Wire",
    desc: "Browse practical Excel tutorials, dynamic array formulas, drop-down validation menus, and reliable spreadsheet data cleaning steps tested by specialists."
  },
  {
    name: "Category: Cloud & Infrastructure",
    title: "Cloud Infrastructure and Linux Setups | TechOps Wire",
    desc: "Browse hands-on Linux administration tutorials, AWS EC2 compute sizing roadmaps, and Docker container networking setups tested on live server deployments."
  },
  {
    name: "Category: AI & Developer Tools",
    title: "AI Developer Tools and API Token Specs | TechOps Wire",
    desc: "Practical developer references covering large language model token contexts, file upload constraints, API response speeds, and production AI utilities."
  },
  {
    name: "Category: OS & Systems",
    title: "Operating Systems and Server Migration | TechOps Wire",
    desc: "Practical operating system manuals covering Windows 11 settings, Linux octal permissions, and structured Windows Server upgrade and migration roadmaps."
  },
  // 8. Authors
  {
    name: "Author: Sarah Blake",
    title: "Sarah Blake | Excel and Data Workflow | TechOps Wire",
    desc: "Sarah Blake is a data operations analyst with 3+ years designing automated reporting workbooks, dynamic financial models, and clean spreadsheet workflows."
  },
  {
    name: "Author: Evan Mitchell",
    title: "Evan Mitchell | Cloud Systems Admin | TechOps Wire",
    desc: "Evan Mitchell is a cloud systems administrator with 3+ years configuring Linux clusters, AWS EC2 instances, and Docker containers in enterprise networks."
  },
  // 9. Articles
  {
    name: "Article: how-to-remove-duplicates-in-excel",
    title: "Remove Duplicates in Excel Step-by-Step | TechOps Wire",
    desc: "Remove duplicate rows in Excel using conditional formatting highlights, the native Remove Duplicates tool, or dynamic UNIQUE formulas without losing data."
  },
  {
    name: "Article: aws-ec2-instance-types-explained",
    title: "AWS EC2 Instance Types and Sizing Steps | TechOps Wire",
    desc: "Compare AWS EC2 instance types across general purpose, compute optimized, and memory families to choose the right virtual machine sizing for your workload."
  },
  {
    name: "Article: why-is-chatgpt-so-slow",
    title: "Why Is ChatGPT So Slow? Causes and Fixes | TechOps Wire",
    desc: "Fix slow ChatGPT response speeds with practical adjustments. Review why token generation lags during peak hours and how to bypass interface bottlenecks."
  },
  {
    name: "Article: windows-11-pro-vs-home",
    title: "Windows 11 Pro vs Home Edition Review | TechOps Wire",
    desc: "Compare Windows 11 Pro and Home editions. Review BitLocker encryption, Remote Desktop host features, Hyper-V virtualization, and enterprise security tools."
  },
  {
    name: "Article: linux-file-permissions-chmod-chown",
    title: "Linux chmod and chown Permissions Steps | TechOps Wire",
    desc: "Understand Linux permissions with chmod and chown commands. Inspect octal modes like 755 and 644, user groups, and safe file security without chmod 777."
  },
  {
    name: "Article: excel-drop-down-list",
    title: "How to Create Drop-Down Lists in Excel | TechOps Wire",
    desc: "Create dynamic drop-down lists in Excel with data validation. Step-by-step tutorial covering auto-expanding lists, dependent menus, and error alert setups."
  },
  {
    name: "Article: docker-container-architecture",
    title: "Docker Container Architecture Steps | TechOps Wire",
    desc: "Understand Docker container architecture including images, persistent storage volumes, and bridge networks on Linux systems with practical command lines."
  },
  {
    name: "Article: chatgpt-file-upload-limits",
    title: "ChatGPT File Upload Limits and Formats | TechOps Wire",
    desc: "Review file upload limits in ChatGPT Plus. Check file size caps, token context window boundaries, and practical methods for processing large spreadsheets."
  },
  {
    name: "Article: windows-server-2019-end-of-life",
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
  const hasAmp = p.title.includes('&') || p.desc.includes('&');
  const hasEmDash = p.title.includes('—') || p.desc.includes('—');
  const hasSpacedHyphen = p.title.includes(' - ') || p.desc.includes(' - ');

  if (!tOk || !dOk || hasAmp || hasEmDash || hasSpacedHyphen) {
    allPassed = false;
  }

  console.log(`[${idx+1}] ${p.name}`);
  console.log(`  Title (${tLen} chars) [${tOk ? 'PASS' : 'FAIL'}]: "${p.title}"`);
  console.log(`  Desc  (${dLen} chars) [${dOk ? 'PASS' : 'FAIL'}]: "${p.desc}"`);
  if (hasAmp) console.log(`  [WARN] Contains &`);
  if (hasEmDash) console.log(`  [WARN] Contains em-dash`);
  if (hasSpacedHyphen) console.log(`  [WARN] Contains spaced hyphen`);
});

console.log("=================================================================");
console.log(`ALL 21 PAGES 100% PERFECT (No '&', raw==HTML, strictly 50-55 / 150-155): ${allPassed}`);
console.log("=================================================================");
