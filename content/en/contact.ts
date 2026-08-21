/**
 * English Contact page copy.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every value below is lifted VERBATIM from the live implementation as it stood at commit
 * 4e283f27, so the Phase G refactor changes nothing a visitor sees on /contact:
 *
 *   app/(en)/(site)/contact/page.tsx   metadata title/description, the Contact2 props
 *                                      (heading, description, email, address, web), and
 *                                      the "Ready to Get Started?" CTA section
 *   components/ui/contact-2.tsx        "Contact Details", the field labels and
 *                                      placeholders, the attachment hint, the Zod
 *                                      validation messages, the submit/loading labels,
 *                                      the success and attachment-notice copy, and the
 *                                      privacy acknowledgement
 *
 * This is the SOURCE OF TRUTH for the pair. No copy editing was done — including where the
 * original wording is imperfect. Two things worth knowing, both left exactly as they were:
 *
 *   · `address` is ASCII "Tresnjinog cveta", missing the š the street name actually has.
 *     Corrected only in the Serbian file, where it matches the approved legal text.
 *   · The CTA body renders as one sentence because JSX collapses its source line break.
 *     Reproduced here as that single rendered string.
 */

import type { ContactDictionary } from '../dictionary'

export const contact: ContactDictionary = {
  metadata: {
    title: 'Contact Infinus - Get Expert SAP Support',
    description:
      'Contact our SAP experts for implementation, support, and consulting services. Get in touch with Infinus, your trusted SAP Gold Partner.',
  },

  hero: {
    heading: 'Start your SAP transformation',
    description:
      "Ready to transform your business with SAP? Get in touch with our expert team for implementation, support, and consulting services. We're here to help you succeed.",
  },

  details: {
    heading: 'Contact Details',
    emailLabel: 'Email: ',
    addressLabel: 'Address: ',
    webLabel: 'Web: ',
    email: 'office@infinus.rs',
    address: 'Tresnjinog cveta 1, Belgrade, Serbia',
    web: { label: 'infinus.co', url: 'https://infinus.co' },
  },

  form: {
    nameLabel: 'Name *',
    namePlaceholder: 'Your full name',
    phoneLabel: 'Phone',
    phonePlaceholder: 'Phone number',
    emailLabel: 'Email *',
    emailPlaceholder: 'your.email@example.com',
    subjectLabel: 'Subject *',
    subjectPlaceholder: "What's this about?",
    messageLabel: 'Message *',
    messagePlaceholder: 'Tell us about your SAP needs or project requirements...',
    attachmentLabel: 'Attachment',
    attachmentHint: 'Supported formats: PDF, DOC, DOCX, TXT (max 10MB)',
    attachmentButton: 'Choose file',
    attachmentEmpty: 'No file selected',
    submit: 'Send Message',
    submitting: 'Sending...',
  },

  validation: {
    name: 'Name must be at least 2 characters',
    email: 'Invalid email address',
    subject: 'Subject must be at least 5 characters',
    message: 'Message must be at least 10 characters',
  },

  success: {
    heading: 'Thank You!',
    body: "Your message has been sent successfully. We'll get back to you soon.",
    sendAnother: 'Send Another Message',
    attachmentNoticeHeading: 'Attachment Notice',
    attachmentNoticeBody:
      'Your message was sent successfully, but the attachment could not be processed. Please try sending the file separately or contact us directly.',
  },

  // Set on `errors.general`, which the component never renders. Known bug, untouched.
  errors: {
    submitFailed: 'Failed to send message. Please try again.',
    unexpected: 'An error occurred. Please try again.',
  },

  privacy: {
    before: 'By submitting this form, you confirm that you have read our ',
    linkText: 'Privacy Policy',
    after: '.',
    href: '/privacy',
  },

  cta: {
    heading: 'Ready to Get Started?',
    body:
      'Join satisfied clients who have transformed their business with our SAP expertise. Contact us today for a free consultation.',
    cards: [
      {
        title: 'Expert Team',
        body: 'Certified SAP professionals with deep industry expertise',
      },
      {
        title: 'Free Consultation',
        body: 'Get expert advice on your SAP implementation needs',
      },
      {
        title: 'Quick Response',
        body: 'We respond to all inquiries within 24 hours',
      },
    ],
  },
}
