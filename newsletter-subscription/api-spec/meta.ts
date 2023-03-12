/* eslint-disable */
import {
  EmailAddressVerifiedEvent,
  NewsletterSubscription,
  VerifiedEmailAddress,
} from "./models";

export const schemaDefinitions = {
  EmailAddressVerifiedEvent: info<EmailAddressVerifiedEvent>(
    "EmailAddressVerifiedEvent",
    "#/definitions/EmailAddressVerifiedEvent"
  ),
  NewsletterSubscription: info<NewsletterSubscription>(
    "NewsletterSubscription",
    "#/definitions/NewsletterSubscription"
  ),
  VerifiedEmailAddress: info<VerifiedEmailAddress>(
    "VerifiedEmailAddress",
    "#/definitions/VerifiedEmailAddress"
  ),
};

export interface SchemaInfo<T> {
  definitionName: string;
  schemaRef: string;
}

function info<T>(definitionName: string, schemaRef: string): SchemaInfo<T> {
  return { definitionName, schemaRef };
}
