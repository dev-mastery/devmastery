/* eslint-disable */
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Represents an email verification
 */
export interface EmailVerification {
  emailAddress: string;
  verificationCode: string;
}
/**
 * A verified email address
 */
export interface VerifiedEmailAddress {
  emailAddress?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface NewEmailAddressEventData {
  emailAddress?: string;
}
export interface NewEmailEvent {
  id?: string;
  data: NewEmailAddressEventData1;
  eventType?: string;
  createdAt?: string;
}
export interface NewEmailAddressEventData1 {
  emailAddress?: string;
}
export interface ApiError {
  status?: number;
  message?: string;
  error?: string;
}
