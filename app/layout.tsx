import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://torny.online"),
  title: {
    default: "Torny AI — Free Philippine Legal Information",
    template: "%s | Torny AI",
  },
  description:
    "Get free, instant legal information based on Philippine law — family, labor, criminal, property, and more. Ask Torny AI 24/7. Not a substitute for a licensed attorney.",
  keywords: [
    "Philippine legal information",
    "Philippines law AI",
    "free legal help Philippines",
    "legal advice Philippines free",
    "batas Pilipinas",
    "family law Philippines",
    "labor rights Philippines",
    "annulment Philippines",
    "illegal dismissal Philippines",
    "criminal law Philippines",
    "PAO alternative",
    "Filipino legal assistant",
    "VAWC Philippines",
    "land title Philippines",
  ],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://torny.online",
    siteName: "Torny AI",
    title: "Torny AI — Free Philippine Legal Information",
    description:
      "Ask about family law, labor rights, criminal defense, property, and more. Free to start. 24/7.",
    images: [
      { url: "/IMG_0461.jpeg", width: 600, height: 600, alt: "Torny AI — Philippine Legal Assistant" },
    ],
  },
  twitter: {
    card: "summary",
    title: "Torny AI — Free Philippine Legal Information",
    description: "Ask about Philippine law — family, labor, criminal, property. Free to start. 24/7.",
    images: ["/IMG_0461.jpeg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://torny.online" },
  verification: { google: "iPXbO2uALY22FmX3VkKfPI1DxcgDKYv3b0a3grIhqP8" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fil"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
