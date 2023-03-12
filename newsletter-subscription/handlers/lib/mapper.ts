import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";
import { NewsletterSubscription as NewsletterSubscriptionData } from "@prisma/client";

export function toDB(
  newsletterSubscription: NewsletterSubscription
): NewsletterSubscriptionData {
  return {
    ...newsletterSubscription,
    subscribedAt: new Date(newsletterSubscription.subscribedAt),
    unsubscribedAt:
      newsletterSubscription.unsubscribedAt != null
        ? new Date(newsletterSubscription.unsubscribedAt)
        : null,
    updatedAt:
      newsletterSubscription.updatedAt != null
        ? new Date(newsletterSubscription.updatedAt)
        : null,
    verifiedEmailAddress: newsletterSubscription.verifiedEmailAddress ?? null,
  };
}

export function toApi(
  newsletterSubscription: NewsletterSubscriptionData
): NewsletterSubscription {
  return {
    ...newsletterSubscription,
    subscribedAt: newsletterSubscription.subscribedAt.toISOString(),
    unsubscribedAt:
      newsletterSubscription.unsubscribedAt?.toISOString() ?? undefined,
    updatedAt: newsletterSubscription.updatedAt?.toISOString() ?? undefined,
    verifiedEmailAddress:
      newsletterSubscription.verifiedEmailAddress ?? undefined,
  };
}
