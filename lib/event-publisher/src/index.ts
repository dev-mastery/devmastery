import { Client } from "@upstash/qstash";
import "isomorphic-fetch";

export interface ApplicationEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  topic: string;
  createdAt: Date;
}

export async function publishEvent(event: ApplicationEvent) {
  ensureEnvironmentVariables();

  let normalizedTopic = event.topic.trim().toLowerCase().replace(/\s+/g, "-");
  let topicUrl = process.env.QSTASH_URL! + normalizedTopic;

  let client = new Client({
    token: process.env.QSTASH_TOKEN!,
  });

  let res = await client.publishJSON({
    url: topicUrl,
    body: event,
  });

  return { ...res, ...event };
}

function ensureEnvironmentVariables() {
  if (process.env.QSTASH_TOKEN === undefined) {
    throw new Error("QSTASH_TOKEN environment variable is not defined");
  }

  if (process.env.QSTASH_URL === undefined) {
    throw new Error("QSTASH_URL environment variable is not defined");
  }
}
