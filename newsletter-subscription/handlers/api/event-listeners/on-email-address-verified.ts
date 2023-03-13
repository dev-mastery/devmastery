import { receiveEvent } from "@devmastery/event-broker";
import { VerifiedEmailAddressDecoder } from "@devmastery/newsletter-subscription-api/decoders";
import { VerifiedEmailAddress } from "@devmastery/newsletter-subscription-api/models";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { confirmNewsletterSubscription } from "../../use-case/confirm-newsletter-subscription";

export default async function onEmailAddressVerified(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === "POST") {
    await postOnEmailAddressVerified(req, res);
  } else if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    res.status(501).end();
  }
}
async function postOnEmailAddressVerified(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const event = await receiveEvent<VerifiedEmailAddress>(req);
    const verifiedEmailAddress = VerifiedEmailAddressDecoder.decode(event.data);
    await confirmNewsletterSubscription(verifiedEmailAddress);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 400,
      message: (error as Error).message,
      error,
    });
  }
}

// Disable bodyParser to let the event-broker compare a hash of the raw body
// to a hash in the signature header for security.
export const config = {
  api: {
    bodyParser: false,
  },
};
