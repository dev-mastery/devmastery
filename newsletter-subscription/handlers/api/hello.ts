import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { ApplicationEvent } from "../../../lib/event-publisher/src/";
import { publishEvent } from "../../../lib/event-publisher/src/";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  let event: ApplicationEvent = {
    id: "123",
    type: "hello",
    data: {
      msg: `Hello from ${request.url}`,
    },
    topic: "hello",
    createdAt: new Date(),
  };
  let result = await publishEvent(event);
  response.status(200).json(result);
}
