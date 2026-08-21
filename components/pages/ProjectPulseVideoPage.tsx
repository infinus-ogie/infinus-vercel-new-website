"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ProjectPulseVideoDictionary } from "@/content/dictionary";

/**
 * The ProjectPulse video overlay, shared by /projectpulse/video and /sr/projectpulse/video.
 *
 * The markup and every effect are exactly what
 * app/(en)/(site)/projectpulse/video/page.tsx had at commit f143256, with the literals
 * replaced by lookups on `content`.
 *
 * A client component: it locks scroll, listens for Escape and calls `router.back()`, so the
 * route file is a thin server wrapper that exports the metadata — a "use client" page cannot
 * export `metadata`, which is why the English route already kept its metadata in a sibling
 * layout.tsx and the Serbian route does the same.
 *
 * `content.videoSrc` is identical in both locales: there is one recording. See
 * content/sr/project-pulse-video.ts.
 */
export interface ProjectPulseVideoPageProps {
  content: ProjectPulseVideoDictionary;
}

export function ProjectPulseVideoPage({ content }: ProjectPulseVideoPageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video path - exact filename from public folder
  const videoPath = content.videoSrc;

  // Prevent scroll but keep current scroll position visible in background
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Prevent scroll but keep the view at current position
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    // Remove any hash from URL to prevent scrolling
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Prevent any scroll events
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('scroll', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    // DO NOT scroll to top - keep current position visible in background

    return () => {
      // Remove event listeners
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);

      // Restore scroll to exact position where user was
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [router]);

  // Handle video load error
  const handleVideoError = () => {
    console.error("Video failed to load:", videoPath);
    // Try alternative path with encoded spaces
    if (videoRef.current) {
      const encodedPath = encodeURI(videoPath);
      videoRef.current.src = encodedPath;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Transparent overlay with backdrop blur - click to close */}
      <div
        onClick={() => router.back()}
        className="absolute inset-0 bg-black/70 backdrop-blur-lg transition-opacity"
        aria-hidden="true"
      />

      {/* Video container with padding from top for navbar */}
      <div className="relative z-10 w-full max-w-6xl mx-4 sm:mx-6 pt-24 pb-8">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute -top-16 right-0 z-20 flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
          aria-label={content.closeAriaLabel}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/30 group-hover:bg-black/70 transition-colors">
            <X className="h-5 w-5" />
            <span className="text-sm font-medium">{content.closeLabel}</span>
          </div>
        </button>

        {/* Video wrapper - prevent click propagation */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20"
        >
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-full h-full"
            src={videoPath}
            onError={handleVideoError}
            preload="auto"
          >
            {content.videoFallback}
          </video>
        </div>

        {/* Title below video - more transparent */}
        <div className="mt-6 text-center">
          <h1 className="text-xl font-semibold text-white/80 mb-2">
            {content.title}
          </h1>
          <p className="text-sm text-white/60">
            {content.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
