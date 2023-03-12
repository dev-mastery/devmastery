import { VercelRequest, VercelResponse } from "@vercel/node";
import { EmailVerificationDecoder } from "../../api-utils/decoders";
import { verifyEmailAddress } from "../../use-case/verify-email-address";

export default async function handleEmailAddressesRequest(
  req: VercelRequest,
  res: VercelResponse
) {
  switch (req.method) {
    case "POST":
      handlePostEmailAddress(req, res);
      break;
    case "GET":
      handleGetEmailAddresses(req, res);
      break;
    case "OPTIONS":
      res.status(200).end();
      break;
    default:
      res.status(405).end();
  }
}

async function handlePostEmailAddress(req: VercelRequest, res: VercelResponse) {
  try {
    let emailVerification = EmailVerificationDecoder.decode(req.body);

    let verifiedEmailAddress = await verifyEmailAddress(emailVerification);

    res.status(200).json(verifiedEmailAddress);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: (error as Error).message,
      error,
    });
  }
}

function handleGetEmailAddresses(req: VercelRequest, res: VercelResponse) {
  //return not implemented response
  res.status(501).json({
    status: 501,
    message: "Not implemented",
  });
}
