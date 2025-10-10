import { ArrowRight, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface DownloadItem {
  id: string;
  title: string;
  description: string;
  label: string;
  url: string;
  image: string;
  analyticsId: string;
}

interface DownloadsBlog7Props {
  tagline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  downloads: DownloadItem[];
}

const DownloadsBlog7 = ({
  tagline = "Resources",
  heading = "Download Materials",
  description = "Access our comprehensive collection of resources, guides, and insights to help you grow your business with SAP solutions.",
  buttonText = "View all resources",
  buttonUrl = "/contact",
  downloads = [],
}: DownloadsBlog7Props) => {
  const handleDownload = (item: DownloadItem) => {
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download', {
        event_category: 'PDF',
        event_label: item.analyticsId,
        value: 1
      });
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto flex flex-col items-center gap-12 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            {tagline}
          </Badge>
          <h2 className="mb-3 text-3xl font-bold md:text-4xl lg:text-5xl text-slate-900">
            {heading}
          </h2>
          <p className="mb-8 text-lg text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
            {description}
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <a href={buttonUrl}>
              {buttonText}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {downloads.map((download) => (
            <Card key={download.id} className="grid grid-rows-[auto_auto_1fr_auto] transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] border-2 border-transparent hover:border-blue-200 hover:bg-blue-50/30">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <Download className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm text-blue-700 font-medium">PDF Document</p>
                </div>
              </div>
              <CardHeader>
                <h3 className="text-lg font-semibold hover:underline md:text-xl text-slate-900">
                  {download.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{download.description}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={download.url}
                  download
                  onClick={() => handleDownload(download)}
                  aria-label={`Preuzmi PDF: ${download.title}`}
                  className="flex items-center text-foreground hover:underline bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="mr-2 size-4" />
                  Preuzmi PDF
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { DownloadsBlog7 };
