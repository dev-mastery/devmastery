import type { VercelRequest, VercelResponse } from "@vercel/node";
import { NewsletterSubscriptionDecoder } from "@devmastery/newsletter-subscription-api/decoders";
import { requestNewsletterSubscription } from "../../use-case/request-newsletter-subscription";

// api/newsletter-subscriptions
export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case "POST":
      createNewsletterSubscription(req, res);
      break;
    case "GET":
      listNewsletterSubscriptions(req, res);
      break;
    default:
      res.status(405).end();
  }
}

async function createNewsletterSubscription(
  req: VercelRequest,
  res: VercelResponse
) {
  let data = NewsletterSubscriptionDecoder.decode(req.body);
  await requestNewsletterSubscription(data);
  res.status(202).json(data);
}

async function listNewsletterSubscriptions(
  req: VercelRequest,
  res: VercelResponse
) {}
