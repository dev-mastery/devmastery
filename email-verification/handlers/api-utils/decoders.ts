/* eslint-disable */

import Ajv from "ajv";

import { Decoder } from "./helpers";
import { validateJson } from "./validate";
import {
  EmailVerification,
  VerifiedEmailAddress,
  NewEmailAddressEventData,
  NewEmailAddressEvent,
  ApiError,
} from "./models";
import jsonSchema from "./schema.json";

const ajv = new Ajv({ strict: false });
ajv.compile(jsonSchema);

// Decoders
export const EmailVerificationDecoder: Decoder<EmailVerification> = {
  definitionName: "EmailVerification",
  schemaRef: "#/definitions/EmailVerification",

  decode(json: unknown): EmailVerification {
    const schema = ajv.getSchema(EmailVerificationDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${EmailVerificationDecoder.definitionName} not found`
      );
    }
    return validateJson(json, schema, EmailVerificationDecoder.definitionName);
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
export const NewEmailAddressEventDataDecoder: Decoder<NewEmailAddressEventData> =
  {
    definitionName: "NewEmailAddressEventData",
    schemaRef: "#/definitions/NewEmailAddressEventData",

    decode(json: unknown): NewEmailAddressEventData {
      const schema = ajv.getSchema(NewEmailAddressEventDataDecoder.schemaRef);
      if (!schema) {
        throw new Error(
          `Schema ${NewEmailAddressEventDataDecoder.definitionName} not found`
        );
      }
      return validateJson(
        json,
        schema,
        NewEmailAddressEventDataDecoder.definitionName
      );
    },
  };
export const NewEmailAddressEventDecoder: Decoder<NewEmailAddressEvent> = {
  definitionName: "NewEmailAddressEvent",
  schemaRef: "#/definitions/NewEmailAddressEvent",

  decode(json: unknown): NewEmailAddressEvent {
    const schema = ajv.getSchema(NewEmailAddressEventDecoder.schemaRef);
    if (!schema) {
      throw new Error(
        `Schema ${NewEmailAddressEventDecoder.definitionName} not found`
      );
    }
    return validateJson(
      json,
      schema,
      NewEmailAddressEventDecoder.definitionName
    );
  },
};
export const ApiErrorDecoder: Decoder<ApiError> = {
  definitionName: "ApiError",
  schemaRef: "#/definitions/ApiError",

  decode(json: unknown): ApiError {
    const schema = ajv.getSchema(ApiErrorDecoder.schemaRef);
    if (!schema) {
      throw new Error(`Schema ${ApiErrorDecoder.definitionName} not found`);
    }
    return validateJson(json, schema, ApiErrorDecoder.definitionName);
  },
};
