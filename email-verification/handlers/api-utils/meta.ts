/* eslint-disable */
import {
  EmailVerification,
  VerifiedEmailAddress,
  NewEmailAddressEventData,
  NewEmailAddressEvent,
  ApiError,
} from "./models";

export const schemaDefinitions = {
  EmailVerification: info<EmailVerification>(
    "EmailVerification",
    "#/definitions/EmailVerification"
  ),
  VerifiedEmailAddress: info<VerifiedEmailAddress>(
    "VerifiedEmailAddress",
    "#/definitions/VerifiedEmailAddress"
  ),
  NewEmailAddressEventData: info<NewEmailAddressEventData>(
    "NewEmailAddressEventData",
    "#/definitions/NewEmailAddressEventData"
  ),
  NewEmailAddressEvent: info<NewEmailAddressEvent>(
    "NewEmailAddressEvent",
    "#/definitions/NewEmailAddressEvent"
  ),
  ApiError: info<ApiError>("ApiError", "#/definitions/ApiError"),
};

export interface SchemaInfo<T> {
  definitionName: string;
  schemaRef: string;
}

function info<T>(definitionName: string, schemaRef: string): SchemaInfo<T> {
  return { definitionName, schemaRef };
}
