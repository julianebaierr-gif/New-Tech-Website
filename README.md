# SysOps Journal 🚀
**Enterprise Cloud Architecture, Linux Systems & Data Automation**

An independent, peer-reviewed technical publication built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Engineered specifically for the **B2B Cloud, DevOps & Enterprise Systems** niche, following all 2026 Google Core Update standards.

---

## ⚡ Features
- **100/100 Core Web Vitals:** Static Site Generation (SSG) with instantaneous TTFB and zero layout shift.
- **2026 SEO Engine:**
  - Automated `noindex` staging protection for `.vercel.app` preview deployments (toggleable in `src/lib/siteConfig.ts`).
  - Dynamic `sitemap.xml` and `robots.txt` generation.
  - Complete JSON-LD Schemas: `Organization`, `WebSite`, `TechArticle`, `FAQPage`, and `BreadcrumbList`.
  - Interactive Table of Contents (TOC) with scroll-spy jump links.
- **E-E-A-T Governance:** Verified author profiles with `sameAs` LinkedIn credentials, dedicated Editorial & Fact-Checking policy pages.

---

## 🛠️ Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live site.

---

## 🚢 Deploying to Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Next.js** (automatically detected).
3. Click **Deploy**.
4. Once your custom domain is attached in Vercel, set `isStaging: false` in `src/lib/siteConfig.ts` to enable full production search engine indexing.
