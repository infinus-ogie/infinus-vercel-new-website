import { Metadata } from "next";
import { SiteChrome } from "@/components/shell/SiteChrome";

export const metadata: Metadata = {
  // `absolute` because this literal already ends in "| Infinus" and the root layout's
  // "%s | Infinus" template would otherwise append a second one, rendering
  // "… | Infinus | Infinus". The openGraph and twitter titles below keep the same literal
  // they have always carried — only the <title> was rendering the brand twice.
  title: { absolute: "GROW with SAP za Professional Services | Infinus" },
  description: "ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije.",
  openGraph: {
    title: "GROW with SAP za Professional Services | Infinus",
    description: "ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije.",
    url: "/professional-services",
    siteName: "Infinus",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "GROW with SAP za Professional Services",
      },
    ],
    locale: "sr_RS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GROW with SAP za Professional Services | Infinus",
    description: "ERP rešenje za rast, agilnost i profitabilnost u profesionalnim uslugama - preuzmite materijale i zakažite konsultacije.",
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "/professional-services",
  },
};

export default function ProfessionalServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
