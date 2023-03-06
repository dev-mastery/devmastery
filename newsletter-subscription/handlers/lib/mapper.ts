import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";
import { NewsletterSubscription as NewsletterSubscriptionData } from "@prisma/client";
export function toDB(
  newsletterSubscription: NewsletterSubscription
): NewsletterSubscriptionData {
  return {
    id: newsletterSubscription.id,
    emailAddress: newsletterSubscription.emailAddress,
    verifiedEmailAddress: newsletterSubscription.verifiedEmailAddress ?? null,
    informedConsent: newsletterSubscription.informedConsent,
    subscribedAt: new Date(newsletterSubscription.subscribedAt),
    unsubscribedAt:
      newsletterSubscription.unsubscribedAt != null
        ? new Date(newsletterSubscription.unsubscribedAt)
        : null,
    firstName: newsletterSubscription.firstName,
    updatedAt:
      newsletterSubscription.updatedAt != null
        ? new Date(newsletterSubscription.updatedAt)
        : null,
    newsletterId: newsletterSubscription.newsletterId,
  };
}

export function toApi(
  newsletterSubscription: NewsletterSubscriptionData
): NewsletterSubscription {
  return {
    emailAddress: newsletterSubscription.emailAddress,
    firstName: newsletterSubscription.firstName,
    id: newsletterSubscription.id,
    informedConsent: newsletterSubscription.informedConsent,
    newsletterId: newsletterSubscription.newsletterId,
    subscribedAt: newsletterSubscription.subscribedAt.toISOString(),
    unsubscribedAt:
      newsletterSubscription.unsubscribedAt?.toISOString() ?? undefined,
    updatedAt: newsletterSubscription.updatedAt?.toISOString() ?? undefined,
    verifiedEmailAddress:
      newsletterSubscription.verifiedEmailAddress ?? undefined,
  };
}
