import {
  ApplicationEvent,
  publishEvent,
  TOPICS,
} from "@devmastery/event-broker";
import { NewsletterSubscription } from "@devmastery/newsletter-subscription-api/models";
import {
  Prisma,
  PrismaClient,
  NewsletterSubscription as NewsletterSubscriptionData,
} from "@prisma/client";
import { toDB } from "../lib/mapper";

type Transaction = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export async function requestNewsletterSubscription(
  subscription: NewsletterSubscription
) {
  let prisma = new PrismaClient();
  let dbSubscription = toDB(subscription);
  await prisma.$transaction(async (tx) => {
    await saveNewsletterSubscriptionRequest(dbSubscription, tx);
    await publishNewsletterSubscriptionRequest(subscription);
  });

  return subscription;
}

export async function publishNewsletterSubscriptionRequest(
  subscription: NewsletterSubscription
) {
  let event: ApplicationEvent = {
    id: subscription.id,
    type: "newsletter-subscription-requested",
    data: subscription,
    topic: TOPICS.NewsletterSubscription,
    createdAt: new Date(),
  };

  await publishEvent(event);
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
