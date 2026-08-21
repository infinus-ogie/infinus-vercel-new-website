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
 *
 * ── Why the overlay sits at z-[45] and not z-[100] ──────────────────────────────
 * It used to be z-[100], which made it the single highest layer on the site and meant it
 * covered the FIXED NAVBAR (z-50) entirely. The language switcher rendered with a correct
 * href and was simply unclickable, and so was every other navigation control — plus the
 * cookie banner (z-[60]) and the consent dialog (z-[70]), which a first-time visitor
 * landing straight on this route could not reach at all.
 *
 * The site's stacking tiers:
 *     z-10 / z-20 / z-40   page content, sticky rails
 *     z-50                 the navbar, modals, the mobile menu, the sticky bar
 *     z-[60]               cookie banner
 *     z-[70]               cookie settings dialog
 *
 * z-[45] puts this overlay above all page content and below every one of those, which is
 * where it belongs: it is a page-level overlay, not a system dialog. Two details confirm
 * this was the original intent — the content container already carries `pt-24`, which
 * exists only to leave room for the navbar, and the backdrop is `absolute inset-0` inside a
 * `fixed inset-0` parent, so it still dims the whole viewport including the strip behind
 * the navbar.
 *
 * Behaviour that is deliberately unchanged: Escape closes, a backdrop click closes, the
 * close button closes, and clicks on the video itself do not propagate. Because the navbar
 * now paints ABOVE the backdrop, a click on the navbar hits the navbar and a click on the
 * dimmed area still hits the backdrop — the two do not compete.
 *
 * No other page is affected: this overlay exists only on the video route.
 *
 * ── Why the close control is pinned to the OVERLAY ──────────────────────────────
 * It used to be `absolute -top-16 right-0` on the video CONTAINER, i.e. 64px above it. That
 * container is vertically centred and its height follows the video's 16:9 aspect ratio, so
 * the control's absolute position drifted with the viewport. Measured, before:
 *
 *     320-430px      y 110..169   usable
 *     1024x900       y   8..46    inside the viewport but BEHIND the z-50 navbar
 *     1440x900       y -42..-4    off-screen entirely
 *
 * Anchoring it to the video wrapper instead was tried and REJECTED. It fixes every width at
 * 900px tall, but the container is taller than a short viewport — at 1280x720 it needs
 * ~856px — and `items-center` on an over-tall child clips the top, pushing the video itself
 * up behind the navbar. The control went with it. Anything positioned relative to that
 * container inherits the container's clipping.
 *
 * Pinning to the fixed overlay makes the position independent of content height entirely:
 * `top-24` is 96px, the navbar's bottom edge is 86-88px at every width, and `right-4`
 * (`sm:right-6`) mirrors the container's own `mx-4 sm:mx-6` so it still lines up with the
 * video's right edge. Verified inside the viewport and clear of the navbar across six widths
 * at both a tall and a short viewport.
 *
 * It sits ABOVE the backdrop (z-20 against the backdrop's z-auto) so clicks reach it rather
 * than dismissing through it, and BELOW the navbar (the whole overlay is z-[45]) so the
 * navbar keeps priority in the strip it occupies. Because it is a sibling of the backdrop
 * rather than a child, a click on it never reaches the backdrop's dismiss handler — the
 * control's own handler is the only one that runs.
 *
 * `min-h-11` (44px) gives it the touch target it lacked; it measured 38px.
 *
 * KNOWN, separate, NOT addressed here: on a viewport shorter than roughly 860px the overlay
 * content is taller than the screen and `items-center` clips the video's top and the caption
 * below it. That is a pre-existing layout issue with the overlay's own sizing, unrelated to
 * the close control, and fixing it means changing how the video is sized.
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
    <div className="fixed inset-0 z-[45] flex items-center justify-center">
      {/* Transparent overlay with backdrop blur - click to close */}
      <div
        onClick={() => router.back()}
        className="absolute inset-0 bg-black/70 backdrop-blur-lg transition-opacity"
        aria-hidden="true"
      />

      {/* Close control — pinned to the OVERLAY, see the note above the component. */}
      <button
        type="button"
        data-testid="video-close"
        onClick={() => router.back()}
        className="absolute right-4 top-24 z-20 flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-white/90 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
        aria-label={content.closeAriaLabel}
      >
        <X className="h-5 w-5" />
        <span className="text-sm font-medium">{content.closeLabel}</span>
      </button>

      {/* Video container with padding from top for navbar */}
      <div className="relative z-10 w-full max-w-6xl mx-4 sm:mx-6 pt-24 pb-8">
        {/* Video wrapper - prevent click propagation */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full aspect-video bg-black rounded-2xl shadow-2xl border border-white/20"
        >
          <video
            ref={videoRef}
            controls
            autoPlay
            className="h-full w-full rounded-2xl"
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
