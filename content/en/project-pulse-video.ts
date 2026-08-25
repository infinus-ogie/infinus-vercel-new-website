/**
 * English ProjectPulse video overlay copy — /projectpulse/video.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Verbatim from app/(en)/(site)/projectpulse/video/page.tsx and its sibling layout.tsx at
 * commit f143256.
 *
 * The route is a full-screen overlay, not a page with chrome: it renders a video, a close
 * control and a caption over a blurred backdrop, and `router.back()` returns the visitor to
 * wherever they came from. `videoSrc` is NOT localised — there is one recording, in
 * English, and the same file is served on both halves of the pair. Logged as a content
 * follow-up rather than solved with a placeholder.
 *
 * `videoFallback` is the text a browser without <video> support shows. It is real
 * user-facing copy even though almost nobody sees it.
 */

import type { ProjectPulseVideoDictionary } from '../dictionary'

export const projectPulseVideo: ProjectPulseVideoDictionary = {
  metadata: {
    title: 'ProjectPulse Video | Infinus',
    description:
      'Watch the ProjectPulse overview, an SAP Qualified Partner-Packaged Solution by Infinus for Professional Services firms.',
  },
  closeAriaLabel: 'Close video',
  closeLabel: 'Close',
  videoFallback: 'Your browser does not support the video tag.',
  title: 'ProjectPulse Overview Video',
  caption:
    'A quick overview of ProjectPulse, a SAP Qualified Partner-Packaged Solution by Infinus',
  videoSrc: '/Project Pulse/Project Pulse -Video/ProjectPulse by Infinus - video UPD2.mp4',
}
