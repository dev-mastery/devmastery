export const EVENT_TYPES = {
  NewsletterSubscriptionRequested: "NEWSLETTER_SUBSCRIPTION_REQUESTED",
  EmailAddressVerified: "EMAIL_ADDRESS_VERIFIED",
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
