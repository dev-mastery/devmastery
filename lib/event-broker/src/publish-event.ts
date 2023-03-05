import { Client, ClientConfig } from "@upstash/qstash";
import { ApplicationEvent } from "./application-event";
import "isomorphic-fetch";

export async function publishEvent(event: ApplicationEvent) {
  let normalizedTopic = normalizeTopic(event.topic);
  let client = makeQstashClient();
  let res = await client.publishJSON({
    topic: normalizedTopic,
    body: event,
  });
  return { ...res, ...event };
}

function ensureEnvironmentVariables() {
  if (process.env.QSTASH_TOKEN === undefined) {
    throw new Error("QSTASH_TOKEN environment variable is not defined");
  }
}

// Qstash topics can only contain lowercase letters, numbers, and hyphens
// but we want to allow spaces and proper capitalization in our topics
function normalizeTopic(topic: string) {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}

function makeQstashClient() {
  ensureEnvironmentVariables();
  let config: ClientConfig = {
    token: process.env.QSTASH_TOKEN!,
  };
  return new Client(config);
}
