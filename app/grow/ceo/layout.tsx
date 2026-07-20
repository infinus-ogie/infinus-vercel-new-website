import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP for CEOs | Infinus",
  description:
    "SAP Cloud ERP + Business AI iz CEO perspektive — kako lider brzorastuće kompanije dobija jedinstven izvor istine, brže odluke i spremnost za rast.",
  openGraph: {
    title: "SAP for CEOs | Infinus",
    description:
      "SAP Cloud ERP + Business AI iz CEO perspektive — kako lider brzorastuće kompanije dobija jedinstven izvor istine, brže odluke i spremnost za rast.",
    url: "/grow/ceo",
    siteName: "Infinus",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "SAP for CEOs",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  alternates: {
    canonical: "/grow/ceo",
  },
};

export default function CeoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
