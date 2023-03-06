import {
  ApplicationEvent,
  publishEvent,
  TOPICS,
} from "@devmastery/event-broker";
import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";
import {
  PrismaClient,
  NewsletterSubscription as NewsletterSubscriptionData,
} from "@prisma/client";
import { toDB } from "../lib/mapper";

const prisma = new PrismaClient();

export async function requestNewsletterSubscription(
  subscription: NewsletterSubscription
) {

  let dbSubscription = toDB(subscription);
  await prisma.$transaction(async (tx: Transaction) => {
    await saveNewsletterSubscriptionRequest(dbSubscription, tx);
    await publishNewsletterSubscriptionRequest(subscription);
  });

  return subscription;
}

async function saveNewsletterSubscriptionRequest(
  subscription: NewsletterSubscriptionData,
  prisma: PrismaClient | Transaction
) {
  return prisma.newsletterSubscription.upsert({
    where: {
      emailAddress: subscription.emailAddress,
    },
    update: subscription,
    create: subscription,
  });
}

export async function publishNewsletterSubscriptionRequest(
  subscription: NewsletterSubscription
) {
  let event: ApplicationEvent<NewsletterSubscription> = {
    id: subscription.id,
    type: "newsletter-subscription-requested",
    data: subscription,
    topic: TOPICS.NewsletterSubscription,
    createdAt: new Date(),
  };

  await publishEvent(event);
}

type Transaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;