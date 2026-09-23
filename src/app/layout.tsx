import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "cloud architecture",
    "devops guides",
    "excel automation",
    "linux server administration",
    "windows 11 enterprise",
    "aws ec2 sizing",
    "sysadmin workflows",
  ],
  authors: siteConfig.authors.map((a) => ({ name: a.name, url: a.socials.linkedin })),
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: siteConfig.isStaging
    ? {
        index: false,
        follow: false,
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.baseUrl}/#organization`,
        "name": siteConfig.name,
        "url": siteConfig.baseUrl,
        "logo": `${siteConfig.baseUrl}/logo.png`,
        "sameAs": [
          "https://twitter.com/sysopsjournal",
          "https://github.com/sysopsjournal",
          "https://linkedin.com/company/sysopsjournal",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": siteConfig.contactEmail,
          "contactType": "editorial support",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.baseUrl}/#website`,
        "url": siteConfig.baseUrl,
        "name": siteConfig.name,
        "description": siteConfig.description,
        "publisher": {
          "@id": `${siteConfig.baseUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth bg-white text-slate-900">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <SchemaJsonLd schema={globalSchema} />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
