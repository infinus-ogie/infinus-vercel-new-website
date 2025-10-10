import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GROW with SAP za Professional Services | Infinus",
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
  return children;
}
