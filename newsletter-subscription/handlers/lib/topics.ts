export const TOPICS = {
  NewsletterSubscription: "newsletter-subscription",
  EmailVerification: "email-verification",
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];
