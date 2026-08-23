/**
 * English Careers page copy.
 *
 * ── Provenance: MOVED, NOT REWRITTEN ────────────────────────────────────────────
 * Every value below is the `join` block of content/en/home.ts, lifted unchanged. The
 * client asked for the application form to leave the homepage and get a page of its own,
 * so the copy moved with it rather than being rewritten for a new context.
 *
 * The two grammar corrections the client asked for landed BEFORE this move, while the copy
 * was still in home.ts, so they are already part of what moved here:
 *
 *   "Due to continues business expansion"   -> "continuous"
 *   "interested to become a member"         -> "interested in becoming"
 *
 * ── What changed in the move, and why so little ─────────────────────────────────
 * Two things, both structural:
 *
 *   · `metadata` is NEW. The block was a homepage section and had no title or description
 *     of its own; a page needs both.
 *   · `faq` is unchanged but is now this page's schema input rather than the homepage's.
 *     The homepage's `structuredFaq` used to end with these same two Q&A, which described
 *     a form that no longer lives there. Leaving them on `/` would advertise an application
 *     process to crawlers on a page that cannot start one.
 *
 * The form itself is untouched: same fields, same Zod RULES, same FormData keys, same POST
 * to /api/join-team. Moving a component must not change an API contract.
 */

import type { CareersDictionary } from '../dictionary'

export const careers: CareersDictionary = {
  metadata: {
    // No brand suffix: the root layout's `%s | Infinus` template appends one, and a
    // title carrying it here renders "… | Infinus | Infinus".
    title: 'Careers - Join Our SAP Team',
    description:
      'We are growing. If you have SAP S/4HANA, ECC, industry or line-of-business experience and want to join a team of dedicated SAP professionals, get in touch.',
  },

  heading: 'Join Our Team',
  paragraphs: [
    'Due to continuous business expansion, we are looking to expand our team.',
    'If you have experience in some of SAP S/4HANA or ECC modules and areas, industry solutions, and/or LOB solutions, and if you are interested in becoming a member of the agile team of dedicated SAP professionals, please contact us.',
    'We will be glad to talk with you!',
  ],

  form: {
    nameLabel: 'Your Name *',
    namePlaceholder: 'Nikola Trivic',
    phoneLabel: 'Phone Number',
    phonePlaceholder: '+381 64 123 4567',
    phoneHint: 'Include country code (E.164 format)',
    emailLabel: 'Your Email *',
    emailPlaceholder: 'name@company.com',
    linkedinLabel: 'LinkedIn URL',
    linkedinPlaceholder: 'https://linkedin.com/in/yourprofile',
    subjectLabel: 'Subject *',
    subjectPlaceholder: 'SAP Consultant Position',
    messageLabel: 'Message *',
    messagePlaceholder: "Tell us about your SAP experience and why you'd like to join our team...",
    fileLabel: 'Attach your resume (optional)',
    fileClickToUpload: 'Click to upload',
    fileOrDragAndDrop: ' or drag and drop',
    fileHint: 'PDF, DOC, DOCX (max 5MB)',
    submit: 'Submit Application',
    submitting: 'Submitting...',
    replyPromise: 'We reply within 1 business day.',
  },

  validation: {
    name: 'Please enter your name.',
    email: 'Enter a valid email address.',
    linkedin: 'Please enter a valid LinkedIn URL.',
    subject: 'Subject is required.',
    message: 'Message should be at least 10 characters.',
    fileType: 'Allowed files: PDF, DOC, DOCX.',
    fileSize: 'Max file size is 5MB.',
  },

  success: "Thanks for your application. We'll get back to you!",

  privacy: {
    before: 'By submitting your application, you confirm that you have read our ',
    linkText: 'Privacy Policy',
    after: '.',
    href: '/privacy',
  },

  faq: [
    {
      title: 'How do I apply?',
      body:
        'Fill in your name, email, phone, subject and message, attach your resume if you have one, and click Submit Application. We will review and get back to you.',
    },
    {
      title: 'What happens after I submit?',
      body:
        'Our team reviews your application and replies by email. If there is a fit, we will schedule an introductory call.',
    },
  ],

  structuredDescription:
    'Open roles and the application process at Infinus, an SAP Gold Partner.',
}
