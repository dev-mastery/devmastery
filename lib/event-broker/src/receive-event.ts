import { IncomingMessage } from "http";
import { ApplicationEvent, isApplicationEvent } from "./application-event";
import { Receiver } from "@upstash/qstash";
import getRawBody from "raw-body";
import { EnvironmentVariableError } from "./errors";

type EventRequest = IncomingMessage;
type EventRequestWithRawBody = EventRequest & { rawBody: Buffer };

const API_KEY_HEADER = "devmastery-api-key";
const UPSTASH_SIGNATURE_HEADER = "upstash-signature";

export async function receiveEvent<TData = any>(request: EventRequest) {
  let rawBody = await getRawBody(request);
  let req = Object.assign(request, { rawBody });
  await verifyRequestSignature(req);
  let jsonBody = extractJsonBody(req);
  let event = ensureBodyIsApplicationEvent(jsonBody);
  return event as ApplicationEvent<TData>;
}

async function verifyRequestSignature(request: EventRequestWithRawBody) {
  if (request.headers[UPSTASH_SIGNATURE_HEADER]) {
    return verifyUpstashSignature(request);
  }
  if (request.headers[API_KEY_HEADER]) {
    return verifyDevmasteryApiKey(request);
  }
  throw new Error("Missing API key or Upstash signature");
}

async function verifyUpstashSignature(request: EventRequestWithRawBody) {
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

async function verifyDevmasteryApiKey(request: EventRequestWithRawBody) {
  let apiKey = request.headers[API_KEY_HEADER] as string;
  if (apiKey !== process.env.DEVMASTERY_API_KEY) {
    throw new Error("Invalid API key");
  }
}

function makeReceiver() {
  let currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  let nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!isValidSigningKey(currentSigningKey)) {
    throw new EnvironmentVariableError("QSTASH_CURRENT_SIGNING_KEY");
  }

  if (!isValidSigningKey(nextSigningKey)) {
    throw new EnvironmentVariableError("QSTASH_NEXT_SIGNING_KEY");
  }

  return new Receiver({
    currentSigningKey,
    nextSigningKey,
  });
}

function extractJsonBody(request: EventRequestWithRawBody): any {
  if (request.rawBody == null) {
    throw new Error("No body found in request");
  }
  try {
    const body = request.rawBody.toString("utf-8");
    return JSON.parse(body);
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

function isValidSigningKey(signingKey: unknown): signingKey is string {
  if (typeof signingKey !== "string") {
    return false;
  }
  return signingKey.trim().startsWith("sig_");
}
