import { ApplicationEvent, publishEvent } from "@devmastery/event-broker";
import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";

export async function requestNewsletterSubscription(
  subscription: NewsletterSubscription
) {
  await publishNewsletterSubscriptionRequest(subscription);
  return subscription;
}

export async function publishNewsletterSubscriptionRequest(
  data: NewsletterSubscription
) {
  let event: ApplicationEvent = {
    id: data.id,
    type: "newsletter-subscription-requested",
    data,
    topic: "newsletter-subscription",
    createdAt: new Date(),
  };

  await publishEvent(event);
}
