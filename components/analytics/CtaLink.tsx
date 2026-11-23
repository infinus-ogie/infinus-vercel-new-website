"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { trackCtaClick } from "@/lib/analytics"

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string }

/**
 * A contact or enquiry link that reports one GA4 `cta_click` when it is clicked.
 *
 * `cta` names the button. The page and language are NOT passed in: they are read from the
 * path the visitor is on when they click, so a button shared by several pages (the case
 * studies, the Grow role pages) always reports the page it was actually clicked on, in the
 * language of that page.
 *
 * `next` renders a next/link `Link` (client-side navigation, as the replaced markup did);
 * without it the element is a plain anchor. Either way navigation is never blocked or
 * delayed, nothing is sent without analytics consent (trackEvent re-reads it at send time),
 * and the ref and every anchor prop are forwarded, so it works as the child of
 * `<Button asChild>`.
 */
export const CtaLink = React.forwardRef<HTMLAnchorElement, AnchorProps & { cta: string; next?: boolean }>(
  function CtaLink({ cta, next = false, onClick, ...rest }, ref) {
    const pathname = usePathname()
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      trackCtaClick(cta, pathname)
    }
    return next ? (
      <Link ref={ref} {...rest} onClick={handleClick} />
    ) : (
      <a ref={ref} {...rest} onClick={handleClick} />
    )
  }
)
