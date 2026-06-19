import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Philippine Legal Information — Ask Torny AI",
  description:
    "Torny AI gives you instant, plain-language answers about Philippine law — annulment, illegal dismissal, VAWC, land titles, criminal rights, and more. First 5 questions free. 24/7.",
  alternates: { canonical: "https://torny.online/home" },
  openGraph: {
    title: "Free Philippine Legal Information — Ask Torny AI",
    description:
      "Get instant legal info on family law, labor rights, criminal cases, and property disputes. Free to start, available 24/7.",
    url: "https://torny.online/home",
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
