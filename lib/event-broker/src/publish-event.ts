import { Client, ClientConfig } from "@upstash/qstash";
import { ApplicationEvent } from "./application-event";
import "isomorphic-fetch";
import { Topic } from "./topics";
import { EnvironmentVariableError } from "./errors";

export async function publishEvent({
  event,
  topic,
}: {
  event: ApplicationEvent;
  topic: Topic;
}) {
  let normalizedTopic = normalizeTopic(topic);
  let client = makeQstashClient();

  let res = await client.publishJSON({
    topic: normalizedTopic,
    body: event,
  });

  return { ...res, ...event };
}

// Qstash topics can only contain lowercase letters, numbers, and hyphens
// but we want to allow spaces and proper capitalization in our topics
function normalizeTopic(topic: string) {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}

function makeQstashClient() {
  let config: ClientConfig = {
    token: getQstashToken(),
  };
  return new Client(config);
}

function getQstashToken() {
  let token = process.env.QSTASH_TOKEN;
  if (typeof token !== "string" || token.trim().length < 80) {
    throw new EnvironmentVariableError("QSTASH_TOKEN");
  }
  return token;
}
