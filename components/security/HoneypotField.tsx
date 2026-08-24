import { HONEYPOT_FIELD } from "@/lib/security/fields";

/**
 * The honeypot input: present for bots, absent for everyone else.
 *
 * ── Hidden in the way that matters ──────────────────────────────────────────────
 * `aria-hidden` plus `tabIndex={-1}` plus off-screen positioning. Three properties, each
 * covering a different visitor:
 *
 *   · sighted mouse users        never see it (positioned outside the viewport)
 *   · keyboard users             never reach it (removed from the tab order)
 *   · screen-reader users        never hear it (aria-hidden)
 *
 * `display: none` alone would be simpler and is what most implementations use — and some
 * bots skip hidden inputs precisely because of that, while some password managers still
 * autofill them. Off-screen positioning is less obviously a trap and less likely to be
 * autofilled for a human.
 *
 * `autoComplete="off"` matters for the same reason: a browser filling this in for a real
 * person would lock them out of the form with no explanation they could act on.
 *
 * ── `id` is REQUIRED, because two forms can share a page ────────────────────────
 * The Serbian MythBusting page renders its form twice. A hardcoded id would put two
 * identical ids in one document, which is exactly what the duplicate-id test added with
 * that page exists to prevent — and would make both labels point at the first input.
 * The caller passes its own already-unique id.
 *
 * ── A second layer, not the layer ───────────────────────────────────────────────
 * Anything that reads the DOM defeats this in a line of code. It is here because it is free
 * and it catches the naive majority — see lib/security/guard.ts for the rest.
 */
export function HoneypotField({ id }: { id: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
    >
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        type="text"
        name={HONEYPOT_FIELD}
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

/**
 * Copy the honeypot's value out of a submitted form and into a hand-built FormData.
 *
 * ── Why this is needed at all ───────────────────────────────────────────────────
 * These forms do NOT build their payload from the form element. They build it field by
 * field from validated state, which is deliberate — it is what keeps the API contract
 * explicit and untranslated. The consequence is that an input which is not in that list
 * never reaches the server, however present it is in the DOM.
 *
 * So the honeypot has to be read out explicitly. Getting this wrong is silent in the worst
 * way: the field renders, the server checks it, and it is empty on every request including
 * the bot ones.
 *
 * ── Scoped to the submitting form ───────────────────────────────────────────────
 * `form.querySelector`, never `document.querySelector`. With two form instances on one page
 * a document-wide lookup would read the FIRST form's honeypot regardless of which one was
 * actually submitted.
 */
export function appendHoneypot(body: FormData, form: HTMLFormElement | null): void {
  const input = form?.querySelector<HTMLInputElement>(`input[name="${HONEYPOT_FIELD}"]`);
  body.append(HONEYPOT_FIELD, input?.value ?? "");
}
