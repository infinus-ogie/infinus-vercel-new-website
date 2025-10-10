'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Download, ExternalLink } from 'lucide-react';

interface BlobDownloadProps {
  filename: string;
  displayName?: string;
  className?: string;
}

export function BlobDownload({ filename, displayName, className }: BlobDownloadProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Učitaj URL iz blob-urls.json
    fetch('/blob-urls.json')
      .then(res => res.json())
      .then(data => {
        const fileUrl = data[filename];
        setUrl(fileUrl);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [filename]);

  if (loading) {
    return (
      <Button disabled className={className}>
        <Download className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (!url) {
    return (
      <Button disabled className={className}>
        <Download className="w-4 h-4 mr-2" />
        File not available
      </Button>
    );
  }

  return (
    <Button asChild className={className}>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        download={displayName || filename}
      >
        <Download className="w-4 h-4 mr-2" />
        {displayName || filename}
        <ExternalLink className="w-3 h-3 ml-2" />
      </a>
    </Button>
  );
}
