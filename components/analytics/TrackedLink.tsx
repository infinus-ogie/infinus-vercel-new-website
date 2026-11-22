"use client"

import * as React from "react"
import { trackEvent, type AnalyticsParams } from "@/lib/analytics"

/**
 * An ordinary anchor that also reports one GA4 event when it is clicked.
 *
 * It exists so a server component can track a link without becoming a client component
 * itself. It forwards its ref and every anchor prop, so it works as the child of
 * `<Button asChild>`. Navigation is never blocked or delayed: the event is handed to gtag
 * and the browser follows the link as usual. Without analytics consent nothing is sent.
 */
export const TrackedLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    event: string
    params: AnalyticsParams
  }
>(function TrackedLink({ event, params, onClick, ...rest }, ref) {
  return (
    <a
      ref={ref}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        trackEvent(event, params)
      }}
    />
  )
})
