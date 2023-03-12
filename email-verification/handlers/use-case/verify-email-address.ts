import { EVENT_TYPES, publishEvent, TOPICS } from "@devmastery/event-broker";
import { EmailAddress, PrismaClient } from "@prisma/client";
import { newId, normalizeEmailAddress } from "@devmastery/utils";

const prisma = new PrismaClient();

export interface EmailVerification {
  emailAddress: string;
  verificationCode: string;
}

// Verifies an email address by normalizing the email address, finding the email
// record, validating that the email record exists, validating the verification
// code, and updating the email record with the verification date.
export async function verifyEmailAddress(verification: EmailVerification) {
  const normalizedEmailAddress = normalizeEmailAddress(verification);
  const maybEmailRecord = await findEmailRecord({
    ...verification,
    emailAddress: normalizedEmailAddress,
  });
  const emailRecord = validateEmailRecordExists(maybEmailRecord);
  validateVerificationCode({
    emailRecord,
    verificationCode: verification.verificationCode,
  });

  return prisma
    .$transaction(async (tx) => {
      let verifiedEmailRecord = await updateEmailRecord({
        emailRecord,
        verifiedAt: new Date(),
        tx,
      });

      await publishEvent({
        topic: TOPICS.EmailVerification,
        event: {
          data: verifiedEmailRecord,
          eventType: EVENT_TYPES.EmailAddressVerified,
          id: newId(),
          occuredAt: new Date(),
        },
      });

      return verifiedEmailRecord;
    })
    .catch((error) => {
      console.error(error);
      throw Error("Unable to verify email address.");
    });
}

// Finds the email record for the given email address.
async function findEmailRecord({ emailAddress }: EmailVerification) {
  return prisma.emailAddress.findFirst({
    where: { emailAddress },
  });
}

// Validates that an email record exists for the given email address.
function validateEmailRecordExists(emailRecord?: EmailAddress | null) {
  if (emailRecord == null) {
    throw new UnknownEmailAddressError();
  }
  return emailRecord;
}

// Validates that the given verification code matches the verification code in
// the email record and that the verification code has not expired.
function validateVerificationCode({
  emailRecord,
  verificationCode,
}: {
  emailRecord: EmailAddress;
  verificationCode: string;
}) {
  let invalid = emailRecord.verificationCode !== verificationCode;

  let expired =
    emailRecord.verificationCodeExpiry == null ||
    emailRecord.verificationCodeExpiry.getTime() < new Date().getTime();

  if (invalid || expired) {
    throw new InvalidVerificationCodeError();
  }
}

// Updates the email record with the verification date.
async function updateEmailRecord({
  emailRecord,
  verifiedAt,
  tx,
}: {
  emailRecord: NonNullable<EmailAddress>;
  verifiedAt: Date;
  tx: Partial<PrismaClient>;
}): Promise<EmailAddress> {
  const { emailAddress } = emailRecord;

  if (tx.emailAddress == null) throw new Error("Invalid db transaction.");

  return tx.emailAddress.update({
    where: { emailAddress },
    data: { verifiedAt },
  });
}

// Determines whether the verification code in the email record has expired.
function isVerificationCodeExpired(emailRecord: EmailAddress) {
  const verificationCodeExpiry = emailRecord?.verificationCodeExpiry?.getTime();
  return (
    verificationCodeExpiry == null ||
    verificationCodeExpiry < new Date().getTime()
  );
}

// Error class for when no email record is found for the given email address.
export class UnknownEmailAddressError extends Error {
  constructor() {
    super("Unknown or invalid email address.");
  }
}

// Error class for when the given verification code is invalid or expired.
export class InvalidVerificationCodeError extends Error {
  constructor() {
    super("Invalid or expired verification code.");
  }
}
