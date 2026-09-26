export interface CategoryConfig {
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  iconName: string;
}

export interface AuthorConfig {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  fullBio: string;
  experienceYears: string;
  location: string;
  certifications: string[];
  skills: string[];
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export const siteConfig = {
  name: "TechOps Wire",
  tagline: "Practical Cloud and Systems Tutorials",
  description: "Tested practical manuals, cloud architecture comparisons, Linux commands, and Excel formulas written and tested by working technicians for IT operations.",
  // When deploying on Vercel preview, set isStaging to true. 
  // Set to false when custom domain is connected to enable full production indexing!
  isStaging: false,
  productionUrl: "https://www.techopswire.com",
  stagingUrl: "https://www.techopswire.com",
  
  get baseUrl() {
    return this.productionUrl;
  },

  editorialStandardsUrl: "/editorial-policy",
  contactEmail: "info.techopswire@gmail.com",
  foundedYear: 2026,

  // 4 Core Categories
  categories: [
    {
      name: "Data & Excel Automation",
      slug: "data-excel-automation",
      description: "Excel formulas, drop-down lists, formatting tricks, and practical data cleaning steps.",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconName: "Table",
    },
    {
      name: "Cloud & Infrastructure",
      slug: "cloud-infrastructure",
      description: "Linux commands, AWS server setups, Docker tips, and network troubleshooting.",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      iconName: "Cloud",
    },
    {
      name: "AI & Developer Tools",
      slug: "ai-developer-tools",
      description: "ChatGPT troubleshooting, developer utilities, file handling tips, and daily productivity fixes.",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      iconName: "Cpu",
    },
    {
      name: "OS & Systems",
      slug: "os-systems",
      description: "Windows 11 settings, Linux file permissions, server migration roadmaps, and maintenance tips.",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      iconName: "Terminal",
    },
  ] as CategoryConfig[],

  // Contributing Authors for Google E-E-A-T
  authors: [
    {
      id: "evan-mitchell",
      name: "Evan Mitchell",
      role: "Cloud Infrastructure Specialist & Systems Administrator",
      avatar: "/authors/evan-mitchell.jpg",
      bio: "Systems administrator with 3+ years managing enterprise Linux servers, AWS EC2 instances, and Docker containers. Evan focuses on practical bash scripting and secure network configurations.",
      fullBio: "Evan Mitchell is a cloud infrastructure technician and systems administrator based in Austin, Texas. Over 3+ years of hands-on operations experience, Evan has deployed and maintained Linux server clusters, architected cost-effective AWS EC2 configurations, and containerized internal applications with Docker. He tests all commands on clean Ubuntu LTS and Debian virtual machines before publishing, ensuring tutorials are accurate and safe for production environments.",
      experienceYears: "3+ Years Industry Experience",
      location: "Austin, Texas, United States",
      certifications: ["AWS Certified Solutions Architect (Associate)", "CompTIA Linux+", "Docker Certified Associate"],
      skills: ["Linux Server Administration (Ubuntu/Debian)", "AWS EC2, VPC & S3", "Docker Networking & Volumes", "Bash Shell Scripting", "Windows Server 2019/2022"],
      socials: {},
    },
    {
      id: "sarah-blake",
      name: "Sarah Blake",
      role: "Senior Data Operations & Spreadsheet Analyst",
      avatar: "/authors/sarah-blake.jpg",
      bio: "Data analyst with 3+ years designing automated reporting engines, dynamic financial spreadsheets, and clean data workflows in Microsoft Excel and Google Sheets.",
      fullBio: "Sarah Blake is a data operations analyst and business intelligence specialist based in Chicago, Illinois. With 3+ years of professional experience in operational analytics and financial modeling, Sarah helps teams eliminate data discrepancies, build dynamic Excel workbooks with XLOOKUP and dynamic arrays, and establish clean spreadsheet validation rules. She focuses on non-destructive data cleaning and reliable formula architecture.",
      experienceYears: "3+ Years Industry Experience",
      location: "Chicago, Illinois, United States",
      certifications: ["Microsoft Office Specialist: Excel Expert", "Google Data Analytics Professional", "Power BI Data Analyst Associate"],
      skills: ["Advanced Excel Formulas (XLOOKUP, FILTER, UNIQUE)", "Data Hygiene & De-duplication", "Data Validation & Dynamic Drop-Down Lists", "Google Sheets Automation", "SQL & Power Query"],
      socials: {},
    },
  ] as AuthorConfig[],
};
