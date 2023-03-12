/* eslint-disable */

import Ajv from "ajv";

import { Decoder } from "./helpers";
import { validateJson } from "./validate";
import {
  EmailAddressVerifiedEvent,
  NewsletterSubscription,
  VerifiedEmailAddress,
} from "./models";
import jsonSchema from "./schema.json";

const ajv = new Ajv({ strict: false });
ajv.compile(jsonSchema);

// Decoders
export const EmailAddressVerifiedEventDecoder: Decoder<EmailAddressVerifiedEvent> =
  {
    definitionName: "EmailAddressVerifiedEvent",
    schemaRef: "#/definitions/EmailAddressVerifiedEvent",

    decode(json: unknown): EmailAddressVerifiedEvent {
      const schema = ajv.getSchema(EmailAddressVerifiedEventDecoder.schemaRef);
      if (!schema) {
        throw new Error(
          `Schema ${EmailAddressVerifiedEventDecoder.definitionName} not found`
        );
      }
      return validateJson(
        json,
        schema,
        EmailAddressVerifiedEventDecoder.definitionName
      );
    },
  };
export const NewsletterSubscriptionDecoder: Decoder<NewsletterSubscription> = {
  definitionName: "NewsletterSubscription",
  schemaRef: "#/definitions/NewsletterSubscription",

  decode(json: unknown): NewsletterSubscription {
    const schema = ajv.getSchema(NewsletterSubscriptionDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${NewsletterSubscriptionDecoder.definitionName} not found`
      );
    }
    return validateJson(
      json,
      schema,
      NewsletterSubscriptionDecoder.definitionName
    );
  },
};
export const VerifiedEmailAddressDecoder: Decoder<VerifiedEmailAddress> = {
  definitionName: "VerifiedEmailAddress",
  schemaRef: "#/definitions/VerifiedEmailAddress",

  decode(json: unknown): VerifiedEmailAddress {
    const schema = ajv.getSchema(VerifiedEmailAddressDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${VerifiedEmailAddressDecoder.definitionName} not found`
      );
    }
    return validateJson(
      json,
      schema,
      VerifiedEmailAddressDecoder.definitionName
    );
  },
};
