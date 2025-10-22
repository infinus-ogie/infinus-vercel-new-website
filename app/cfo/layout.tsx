import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP for CFOs — Infinus",
  description:
    "SAP Cloud ERP + Business AI — 10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup",
  openGraph: {
    title: "SAP for CFOs — Infinus",
    description:
      "SAP Cloud ERP + Business AI — 10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup",
    url: "/cfo",
    siteName: "Infinus",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "SAP for CFOs",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAP for CFOs — Infinus",
    description:
      "SAP Cloud ERP + Business AI — 10 dugoročnih prednosti iz CFO perspektive u odnosu na tradicionalni „ERP + Excel“ pristup",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "/cfo",
  },
};

export default function CFOLayout({ children }: { children: React.ReactNode }) {
  return children;
}


