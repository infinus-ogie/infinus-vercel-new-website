# ProjectPulse — where the content and schemas live

This directory used to be self-contained: `_config.ts` held the copy, `_jsonld.ts` derived
the schemas from it, and `_components/ProjectPulseContent.tsx` rendered it. All three are
gone, because /projectpulse is now half of a locale pair and none of that could stay
English-only.

## Current layout

| What                      | Where                                              |
| ------------------------- | -------------------------------------------------- |
| English copy              | `content/en/project-pulse.ts`                      |
| Serbian copy              | `content/sr/project-pulse.ts`                      |
| The shape both must match | `ProjectPulseDictionary` in `content/dictionary.ts` |
| The rendered body         | `components/pages/ProjectPulsePage.tsx`            |
| The seven JSON-LD objects | `lib/project-pulse-jsonld.ts`                      |
| The English route         | `app/(en)/(site)/projectpulse/page.tsx`            |
| The Serbian route         | `app/(sr)/sr/projectpulse/page.tsx`                |

The brochure (`brochure/`) and the video overlay (`video/`) follow the same pattern with
their own namespaces: `projectPulseBrochure` and `projectPulseVideo`.

## How to change content

Edit `content/en/project-pulse.ts` **and** `content/sr/project-pulse.ts`. The types make a
missing key a compile error and `test/i18n/dictionary.test.ts` compares the two key sets, so
a one-sided edit fails the build rather than shipping an English string onto the Serbian
page. There is no fallback to English by design.

The old auto-sync property still holds: the schemas read the same dictionary the page does,
so copy and JSON-LD cannot drift. What changed is that the sync now spans two locales.

## What is NOT in the dictionary

Icons. `ProjectPulsePage.tsx` holds them as positional arrays — `INDUSTRY_ICONS`,
`WHAT_YOU_GAIN_ICONS`, `VALUE_PROPOSITION_ICONS`, `MICRO_CARD_ICONS` — matched by index
against the corresponding fixed-length tuple in the dictionary. The previous code mapped
industry icons from a `Record` keyed on the **English** industry name, which would have
silently fallen back to one generic icon for every Serbian label. Adding an industry means
adding an entry to both content files and an icon to `INDUSTRY_ICONS`, and widening the tuple
type.

## Sections that exist but are not rendered

"How it works", "Outcomes by role", "Implementation" and "About Infinus" are commented out
in `ProjectPulsePage.tsx` and were already commented out before the locale split. Their copy
is still carried in both dictionaries, and two of them still feed the JSON-LD:

- `howItWorks.microCards[].description` and `valueProposition.items[].description` are
  concatenated into the SoftwareApplication `featureList`.
- `implementation.subtitle` and `implementation.phases` build the entire HowTo schema.

So do not delete those keys because the section looks dead — check the schema builder first.
