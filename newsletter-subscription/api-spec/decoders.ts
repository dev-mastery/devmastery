/* eslint-disable */

import Ajv from "ajv";

import { Decoder } from "./helpers";
import { validateJson } from "./validate";
import { NewsletterSubscription } from "./models";
import jsonSchema from "./schema.json";

const ajv = new Ajv({ strict: false });
ajv.compile(jsonSchema);

// Decoders
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
