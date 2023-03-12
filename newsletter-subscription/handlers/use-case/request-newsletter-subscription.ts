import {
  ApplicationEvent,
  EVENT_TYPES,
  publishEvent,
  TOPICS,
} from "@devmastery/event-broker";
import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";
import { NewsletterSubscription as NewsletterSubscriptionData } from "@prisma/client";
import { toApi, toDB } from "../lib/mapper";
import { db, DbClient } from "../lib/db";

export async function requestNewsletterSubscription(
  subscription: NewsletterSubscription
) {
  let subscriptionData = toDB(subscription);

  let savedSubscriptionData = await db.$transaction(async (tx: Transaction) => {
    let saved = await saveNewsletterSubscriptionRequest({
      subscriptionData,
      tx,
    });

    await publishNewsletterSubscriptionRequest(subscription);

    return saved;
  });

  return toApi(savedSubscriptionData);
}

async function saveNewsletterSubscriptionRequest({
  subscriptionData,
  tx,
}: {
  subscriptionData: NewsletterSubscriptionData;
  tx: Partial<DbClient>;
}) {
  if (tx.newsletterSubscription == null) {
    throw new Error(
      "Invalid db transaction. NewsletterSubscription entity not found."
    );
  }

  let { emailAddress, subscribedAt, id, ...updatedInfo } = subscriptionData;

  return tx.newsletterSubscription.upsert({
    where: {
      emailAddress,
    },
    create: subscriptionData,
    update: updatedInfo,
  });
}

export async function publishNewsletterSubscriptionRequest(
  subscription: NewsletterSubscription
) {
  let event: ApplicationEvent<NewsletterSubscription> = {
    id: subscription.id,
    eventType: EVENT_TYPES.NewsletterSubscriptionRequested,
    data: subscription,
    occuredAt: new Date(),
  };

  await publishEvent({
    event,
    topic: TOPICS.NewsletterSubscription,
  });
}

type Transaction = Omit<
  DbClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;
