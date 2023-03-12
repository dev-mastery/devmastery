import { receiveEvent } from "@devmastery/event-broker";
import {
  EmailAddressVerifiedEventDecoder,
  VerifiedEmailAddressDecoder,
} from "@devmastery/newsletter-subscription-api/decoders";
import {
  EmailAddressVerifiedEvent,
  VerifiedEmailAddress,
} from "@devmastery/newsletter-subscription-api/models";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { confirmNewsletterSubscription } from "../../use-case/confirm-newsletter-subscription";

export async function onEmailAddressVerified(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "POST") {
    await postOnEmailAddressVerified(req, res);
  } else if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    return res.status(501).end();
  }
}
async function postOnEmailAddressVerified(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const event = await receiveEvent<VerifiedEmailAddress>(req);
    const verifiedEmailAddress = VerifiedEmailAddressDecoder.decode(event);
    await confirmNewsletterSubscription(verifiedEmailAddress);
    return res.status(200).end();
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: (error as Error).message,
      error,
    });
  }
}
