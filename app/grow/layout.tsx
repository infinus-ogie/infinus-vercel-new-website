import { Metadata } from "next";
import { growConfig } from "./_config";

export const metadata: Metadata = {
  title: growConfig.page.title,
  description: growConfig.page.description,
  openGraph: {
    title: growConfig.page.title,
    description: growConfig.page.description,
    url: "/grow",
    siteName: "Infinus",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: growConfig.page.title,
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  alternates: {
    canonical: "/grow",
  },
};

export default function GrowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
