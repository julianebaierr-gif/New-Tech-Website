import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/siteConfig";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchemaJsonLd } from "@/components/SchemaJsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
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
  authors: siteConfig.authors.map((a) => ({ name: a.name, url: `${siteConfig.baseUrl}/authors/${a.id}` })),
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
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.baseUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [`${siteConfig.baseUrl}/logo.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
  verification: {
    google: siteConfig.googleSiteVerification,
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
          "https://twitter.com/techopswire",
          "https://github.com/techopswire",
          "https://linkedin.com/company/techopswire",
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
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteConfig.baseUrl}/category/data-excel-automation?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth bg-white text-slate-900">
      <head>
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
