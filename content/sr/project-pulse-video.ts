/**
 * Serbian ProjectPulse video overlay copy — /sr/projectpulse/video.
 *
 * ── Provenance: OWNER-APPROVED ─────────────────────────────────────────────────
 * Signed off after the full H2/H3 411-string side-by-side review. No wording changed at
 * review: every string in this file was approved exactly as translated.
 *
 * ── KNOWN CONTENT GAP — approved as a temporary state ──────────────────────────
 * The Serbian page intentionally uses the existing ENGLISH ProjectPulse recording until a
 * Serbian recording or Serbian subtitles are supplied. `videoSrc` is therefore identical to
 * the English value, by decision and not by oversight.
 *
 * This is the owner's explicit ruling: do not fabricate a Serbian video asset, and do not
 * invent a future URL for one. When a Serbian recording or a subtitle track exists, the only
 * change needed is this one field.
 *
 * Everything the visitor reads AROUND the player is Serbian: heading, caption, the close
 * control and its accessible name, and the <video> fallback text.
 *
 * ── Translation decisions ──────────────────────────────────────────────────────
 * "Close" is the visible label on the control and "Close video" is its accessible name; the
 * distinction is preserved rather than collapsed into one string.
 */

import type { ProjectPulseVideoDictionary } from '../dictionary'

export const projectPulseVideo: ProjectPulseVideoDictionary = {
  metadata: {
    title: 'ProjectPulse video | Infinus',
    description:
      'Pogledajte pregled rešenja ProjectPulse, SAP Qualified Partner-Packaged Solution kompanije Infinus za kompanije iz oblasti profesionalnih usluga.',
  },
  closeAriaLabel: 'Zatvori video',
  closeLabel: 'Zatvori',
  videoFallback: 'Vaš pregledač ne podržava prikaz videa.',
  title: 'ProjectPulse - video pregled',
  caption:
    'Kratak pregled rešenja ProjectPulse, SAP Qualified Partner-Packaged Solution kompanije Infinus',
  // The English recording, shared deliberately — see the KNOWN CONTENT GAP note above.
  videoSrc: '/Project Pulse/Project Pulse -Video/ProjectPulse by Infinus - video UPD2.mp4',
}
