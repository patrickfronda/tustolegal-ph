import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://torny.ai";

export const metadata: Metadata = {
  title: "Torny.ai — Legal Assistance for Every Filipino",
  description:
    "Free legal guidance and advice rooted in Philippine law. Get answers on family law, labor rights, criminal defense, property, and more.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Torny.ai — Libreng Legal na Gabay para sa Bawat Pilipino",
    description:
      "Huwag nang malito sa iyong legal na kalagayan. Torny.ai ay nagbibigay ng libreng gabay batay sa mga batas ng Pilipinas — pamilya, trabaho, krimen, ari-arian, at higit pa.",
    url: siteUrl,
    siteName: "Torny.ai",
    locale: "fil_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torny.ai — Libreng Legal na Gabay para sa Bawat Pilipino",
    description:
      "Free legal guidance rooted in Philippine law. Family, labor, criminal, property — ask Torny for free.",
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
