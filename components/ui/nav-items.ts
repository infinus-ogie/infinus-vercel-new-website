import type { NavDictionary, NavMenuEntry } from "@/content/dictionary"

/**
 * The bridge between the nav DICTIONARY and what the two navbar components render.
 *
 * It exists so the desktop bar (components/ui/tubelight-navbar.tsx) and the mobile panel
 * (components/ui/navbar-demo.tsx) cannot disagree about the menu. They used to build their
 * lists from the same inline array; now that a dropdown can contain headings as well as
 * links, "flatten this for path matching" is real logic, and two copies of it would drift.
 *
 * Presentation stays in the components: icons, colours, animation. This module knows only
 * about structure.
 */

/** A link inside a dropdown, in the shape the navbar components consume. */
export interface NavSubLink {
  name: string
  url: string
}

/** One dropdown entry: a link, or a heading over its own links. */
export type NavSubEntry =
  | { kind: "link"; name: string; url: string }
  | { kind: "group"; name: string; items: NavSubLink[] }

export interface NavItem {
  name: string
  url: string
  icon?: React.ReactNode
  /** Present on the three grouped entries; absent on Home and Contact. */
  submenu?: NavSubEntry[]
}

function toEntry(entry: NavMenuEntry): NavSubEntry {
  if (entry.kind === "group") {
    return {
      kind: "group",
      name: entry.label,
      items: entry.items.map((item) => ({ name: item.label, url: item.href })),
    }
  }
  return { kind: "link", name: entry.label, url: entry.href }
}

/**
 * The five top-level entries, in order, from a locale's nav dictionary.
 *
 * `url` is "#" for the three dropdowns. They are TRIGGERS, not destinations — Company,
 * Expertise and Insights are groupings with no page of their own, and giving them the URL
 * of one of their children is the exact thing the owner ruled out.
 */
export function navItemsFor(nav: NavDictionary): NavItem[] {
  return [
    { name: nav.home.label, url: nav.home.href },
    { name: nav.company.label, url: "#", submenu: nav.company.entries.map(toEntry) },
    { name: nav.expertise.label, url: "#", submenu: nav.expertise.entries.map(toEntry) },
    { name: nav.insights.label, url: "#", submenu: nav.insights.entries.map(toEntry) },
    { name: nav.contact.label, url: nav.contact.href },
  ]
}

/**
 * Every real link inside a dropdown, headings excluded.
 *
 * Used for active-tab detection: a heading has no URL, so "does the current path appear in
 * this menu?" has to look past it. Before headings existed this was `submenu.some(...)`;
 * doing that now would read `undefined` off a group and silently never match.
 */
export function submenuLinks(entries: NavSubEntry[] | undefined): NavSubLink[] {
  if (!entries) return []
  const out: NavSubLink[] = []
  for (const entry of entries) {
    if (entry.kind === "group") out.push(...entry.items)
    else out.push({ name: entry.name, url: entry.url })
  }
  return out
}
