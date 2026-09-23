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
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export const siteConfig = {
  name: "SysOps Journal",
  tagline: "Enterprise Systems, Cloud Architecture & Data Automation",
  description: "Peer-reviewed technical guides, cloud architecture blueprints, and enterprise automation tutorials for DevOps engineers and system administrators.",
  // When deploying on Vercel preview, set isStaging to true. 
  // Set to false when custom domain is connected to enable full production indexing!
  isStaging: false, // Set to true if testing on .vercel.app, false for production
  productionUrl: "https://sysopsjournal.com",
  stagingUrl: "https://sysops-journal.vercel.app",
  
  get baseUrl() {
    return this.isStaging ? this.stagingUrl : this.productionUrl;
  },

  editorialStandardsUrl: "/editorial-policy",
  contactEmail: "editorial@sysopsjournal.com",
  foundedYear: 2026,

  // 4 Core High-Authority Silos
  categories: [
    {
      name: "Data & Excel Automation",
      slug: "data-excel-automation",
      description: "Enterprise spreadsheet formulas, data cleaning pipelines, and automated reporting workflows.",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconName: "Table",
    },
    {
      name: "Cloud & Infrastructure",
      slug: "cloud-infrastructure",
      description: "AWS architecture, Linux server administration, Docker containerization, and enterprise DevOps.",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      iconName: "Cloud",
    },
    {
      name: "AI & Developer Tools",
      slug: "ai-developer-tools",
      description: "Autonomous agent workflows, LLM latency optimization, API integrations, and developer toolchains.",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      iconName: "Cpu",
    },
    {
      name: "OS & Systems",
      slug: "os-systems",
      description: "Windows 11 Enterprise, macOS power workflows, BIOS hardware virtualization, and system diagnostics.",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      iconName: "Terminal",
    },
  ] as CategoryConfig[],

  // Verified Expert Authors for E-E-A-T
  authors: [
    {
      id: "marcus-vance",
      name: "Marcus Vance",
      role: "Lead Cloud Architect & Systems Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Former Principal Systems Engineer with 14+ years designing high-availability Linux infrastructure and cloud automation pipelines.",
      socials: {
        linkedin: "https://www.linkedin.com/in/marcus-vance-cloud",
        github: "https://github.com/marcus-vance",
        twitter: "https://twitter.com/marcus_vance_ops",
      },
    },
    {
      id: "elena-rostova",
      name: "Elena Rostova",
      role: "Senior Data Operations Engineer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
      bio: "Specializes in enterprise financial modeling, data hygiene workflows, and high-volume Excel and SQL analytics pipelines.",
      socials: {
        linkedin: "https://www.linkedin.com/in/elena-rostova-data",
        github: "https://github.com/elena-rostova",
      },
    },
  ] as AuthorConfig[],
};
