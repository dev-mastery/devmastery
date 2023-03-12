import { VerifiedEmailAddress } from "@devmastery/newsletter-subscription-api/models";
import { db } from "../lib/db";

export async function confirmNewsletterSubscription(
  verifiedEmailAddress: VerifiedEmailAddress
) {
  let existingSubscription = await db.newsletterSubscription.findUnique({
    where: { emailAddress: verifiedEmailAddress.emailAddress },
  });
  if (existingSubscription != null) {
    await db.newsletterSubscription.update({
      where: { emailAddress: verifiedEmailAddress.emailAddress },
      data: { verifiedEmailAddress: verifiedEmailAddress.emailAddress },
    });
  }
}
