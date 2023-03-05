import type { VercelRequest, VercelResponse } from "@vercel/node";
import { NewsletterSubscriptionDecoder } from "@devmastery/newsletter-subscription-api/decoders";
import { requestNewsletterSubscription } from "../use-cases/request-newsletter-subscription";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case "POST":
      postNewsletterSubscription(req, res);
      break;
    default:
      res.status(405).end();
  }
}

async function postNewsletterSubscription(
  req: VercelRequest,
  res: VercelResponse
) {
  let data = NewsletterSubscriptionDecoder.decode(req.body);
  await requestNewsletterSubscription(data);
  res.status(202).json(data);
}
