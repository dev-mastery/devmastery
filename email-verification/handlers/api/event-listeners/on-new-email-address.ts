import { receiveEvent } from "@devmastery/event-broker";
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  requestEmailAddressVerification,
  EmailAddressVerificationRequest,
} from "../../use-case/request-email-address-verification";

export default async function onNewEmailAddress(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    let { data: emailAddressVerificationRequest } =
      await receiveEvent<EmailAddressVerificationRequest>(req);

    await requestEmailAddressVerification(emailAddressVerificationRequest);
    res.status(200).send("OK");
  } catch (error) {
    let errorResponse = {
      status: 400,
      msg: (error as Error).message,
      occuredAt: new Date().toISOString(),
    };
    console.error(error);
    res.status(400).json(errorResponse);
  }
}
