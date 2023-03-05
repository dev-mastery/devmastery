/* eslint-disable */
import { NewsletterSubscription } from "./models";

export const schemaDefinitions = {
  NewsletterSubscription: info<NewsletterSubscription>(
    "NewsletterSubscription",
    "#/definitions/NewsletterSubscription"
  ),
};

export interface SchemaInfo<T> {
  definitionName: string;
  schemaRef: string;
}

function info<T>(definitionName: string, schemaRef: string): SchemaInfo<T> {
  return { definitionName, schemaRef };
}
