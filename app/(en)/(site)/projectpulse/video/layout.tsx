import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProjectPulse Video | Infinus",
  description:
    "Watch the ProjectPulse overview — an SAP Qualified Partner-Packaged Solution by Infinus for Professional Services firms.",
  alternates: {
    canonical: "/projectpulse/video",
  },
};

export default function ProjectPulseVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
