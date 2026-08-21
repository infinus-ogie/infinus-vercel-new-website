"use client";

import { ProjectPulseVideoPage } from "@/components/pages/ProjectPulseVideoPage";
import { getDictionary } from "@/content/dictionary";

/**
 * SERBIAN ProjectPulse video overlay — /sr/projectpulse/video.
 *
 * The overlay comes from components/pages/ProjectPulseVideoPage.tsx — the same component
 * /projectpulse/video renders. Metadata lives in the sibling layout.tsx, mirroring the
 * English half, because a "use client" page cannot export `metadata`.
 *
 * The visible chrome is Serbian; the video itself is the single English recording. See
 * content/sr/project-pulse-video.ts.
 */

const content = getDictionary("sr").projectPulseVideo;

export default function SerbianProjectPulseVideoRoute() {
  return <ProjectPulseVideoPage content={content} />;
}
