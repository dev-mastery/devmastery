import { newId } from "@devmastery/utils";
import Email from "@sendgrid/mail";
import { EmailAddress as EmailAddressData, PrismaClient } from "@prisma/client";
import { normalizeEmailAddress } from "../../../lib/utils/src/normalize-email-address";

const MAX_VERIFICATION_AGE_IN_HOURS = 8;

const prisma = new PrismaClient();

export interface EmailAddressVerificationRequest {
  emailAddress: string;
  verificationCode?: string;
}

/**
 * Stores an email address and its associated verification code in the database
 * and sends an email to the specified address with the verification code.
 *
 * This function is implemented as a transaction to ensure that the
 * verification code is saved to the database before the email is sent.
 */
export async function requestEmailAddressVerification(
  verification: EmailAddressVerificationRequest
) {
  let emailAddress = normalizeEmailAddress(verification);
  let emailAddressVerificationData;
  prisma.$transaction(async (tx: Partial<PrismaClient>) => {
    const verificationCode = verification.verificationCode ?? newId();

    emailAddressVerificationData = await saveEmailAddress({
      data: {
        emailAddress,
        verificationCode,
        verificationCodeExpiry: calculateVerificationCodeExpiry(),
        verifiedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      tx,
    });

    await sendVerificationEmail({
      emailAddress,
      verificationCode,
    });
  });

  return emailAddressVerificationData;
}

function calculateVerificationCodeExpiry() {
  const now = new Date();
  const hourInMs = 60 * 60 * 1000;
  const maxAgeInMs = MAX_VERIFICATION_AGE_IN_HOURS * hourInMs;
  const expiry = now.getTime() + maxAgeInMs;

  return new Date(expiry);
}

/**
 * Saves an email address and its associated verification code in the database.
 * If an email address with the same value already exists, its verification code
 * is updated. If no email address with the same value exists, a new Data is
 * created.
 *
 * @param data - The email address and its associated verification code
 * @param tx - The transaction object
 */
async function saveEmailAddress({
  data,
  tx,
}: {
  data: EmailAddressData;
  tx: Partial<PrismaClient>;
}) {
  const normalizedEmailAddress = normalizeEmailAddress(data);
  const emailData = {
    ...data,
    emailAddress: normalizedEmailAddress,
  };
  // enforce idempotency
  const exactMatch = await tx.emailAddress?.findUnique({ where: emailData });
  if (exactMatch != null) {
    return exactMatch;
  }

  return tx.emailAddress?.upsert({
    where: { emailAddress: normalizedEmailAddress },
    update: {
      verificationCode: data.verificationCode,
      verificationCodeExpiry: data.verificationCodeExpiry,
      updatedAt: new Date(),
    },
    create: {
      ...emailData,
      updatedAt: null,
    },
  });
}

// Send a verification email to the user with the specified email address.
async function sendVerificationEmail(verification: {
  emailAddress: string;
  verificationCode: string;
}) {
  if (process.env.SENDGRID_API_KEY === undefined) {
    throw new Error("SENDGRID_API_KEY environment variable is not defined");
  }
  Email.setApiKey(process.env.SENDGRID_API_KEY!);

  const emailMessage = {
    to: verification.emailAddress,
    from: "auto-verify@devmastery.com",
    subject: "Verify your email address",
    text: `Please verify your email address by clicking this link: https://devmastery.com/verify-email-address?code=${verification.verificationCode}`,
    html: `<p>Please verify your email address by clicking this link: <a href="https://devmastery.com/verify-email-address?code=${verification.verificationCode}">Verify now.</a></p>`,
  };

  return Email.send(emailMessage);
}
