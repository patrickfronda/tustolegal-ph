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
  title: "Torny AI — Your 24/7 Legal Assistant",
  description:
    "Get instant legal guidance rooted in Philippine law. Ask about family law, labor rights, criminal defense, property, and more — anytime, 24/7.",
  openGraph: {
    title: "Torny AI — Your 24/7 Philippine Legal Assistant",
    description:
      "Free legal information on Family, Labor, Criminal & Property law — in English & Filipino. Confidential, 24/7.",
    url: "https://torny.online",
    siteName: "Torny AI",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torny AI — Your 24/7 Philippine Legal Assistant",
    description:
      "Free legal information on Family, Labor, Criminal & Property law — in English & Filipino. Confidential, 24/7.",
  },
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
