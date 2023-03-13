import { IncomingMessage } from "http";
import { ApplicationEvent, isApplicationEvent } from "./application-event";
import { Receiver } from "@upstash/qstash";
import type { Readable } from "node:stream";

type EventRequest = IncomingMessage;
type EventRequestWithParsedBody = EventRequest & { body: any; rawBody: Buffer };

const API_KEY_HEADER = "devmastery-api-key";
const UPSTASH_SIGNATURE_HEADER = "upstash-signature";

export async function receiveEvent<TData = any>(request: EventRequest) {
  let rawBody = await buffer(request);
  let body = rawBody.toString("utf-8");
  let req = Object.assign(request, { body, rawBody });
  await verifyRequestSignature(req);
  let jsonBody = extractJsonBody(req);
  let event = ensureBodyIsApplicationEvent(jsonBody);
  return event as ApplicationEvent<TData>;
}

async function verifyRequestSignature(request: EventRequestWithParsedBody) {
  if (request.headers[UPSTASH_SIGNATURE_HEADER]) {
    return verifyUpstashSignature(request);
  }
  if (request.headers[API_KEY_HEADER]) {
    return verifyDevmasteryApiKey(request);
  }
  throw new Error("Missing API key or Upstash signature");
}

async function verifyUpstashSignature(request: EventRequestWithParsedBody) {
  let receiver = makeReceiver();
  let verified = await receiver.verify({
    signature: request.headers[UPSTASH_SIGNATURE_HEADER] as string,
    body: request.rawBody,
    clockTolerance: 5,
  });

  if (!verified) {
    throw new Error("Invalid Upstash signature");
  }
}

async function verifyDevmasteryApiKey(request: EventRequestWithParsedBody) {
  let apiKey = request.headers[API_KEY_HEADER] as string;
  if (apiKey !== process.env.DEVMASTERY_API_KEY) {
    throw new Error("Invalid API key");
  }
}

function makeReceiver() {
  ensureEnvironmentVariables();
  return new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });
}

function extractJsonBody(request: EventRequestWithParsedBody): any {
  if (!request.body) {
    throw new Error("No body found in request");
  }
  console.log(request.body);
  try {
    return typeof request.body == "object"
      ? request.body
      : JSON.parse(request.body);
  } catch (err) {
    throw new TypeError(
      `Could not parse request body as JSON: ${(err as Error).message}`
    );
  }
}

function ensureBodyIsApplicationEvent(body: unknown) {
  if (!isApplicationEvent(body)) {
    throw new TypeError("Request body is not an ApplicationEvent");
  }
  return body;
}

function ensureEnvironmentVariables() {
  if (process.env.QSTASH_CURRENT_SIGNING_KEY === undefined) {
    throw new Error(
      "QSTASH_CURRENT_SIGNING_KEY environment variable is not defined"
    );
  }

  if (process.env.QSTASH_NEXT_SIGNING_KEY === undefined) {
    throw new Error(
      "QSTASH_CURRENT_SIGNING_KEY environment variable is not defined"
    );
  }
}

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}
