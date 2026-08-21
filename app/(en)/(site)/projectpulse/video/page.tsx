"use client";

import { ProjectPulseVideoPage } from "@/components/pages/ProjectPulseVideoPage";
import { getDictionary } from "@/content/dictionary";

/**
 * ENGLISH ProjectPulse video overlay — the English half of the projectpulse-video pair.
 *
 * Phase H3 moved the overlay itself to components/pages/ProjectPulseVideoPage.tsx (shared
 * with /sr/projectpulse/video) and its copy to content/en/project-pulse-video.ts verbatim.
 * Nothing about what renders changed.
 *
 * The metadata still lives in the sibling layout.tsx, because a "use client" page cannot
 * export `metadata`. That is where the hreflang was added.
 */

const content = getDictionary("en").projectPulseVideo;

export default function EnglishProjectPulseVideoRoute() {
  return <ProjectPulseVideoPage content={content} />;
}
