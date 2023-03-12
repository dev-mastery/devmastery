export function normalizeEmailAddress({
  emailAddress,
}: {
  emailAddress: string;
}): string {
  const [user, domain] = emailAddress.trim().split("@");
  const normalizedUser = user.toLowerCase().replace(/\+.*/, ""); // Remove everything from "+" to "@"
  return `${normalizedUser}@${domain}`;
}
