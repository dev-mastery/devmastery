import { DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export type UnsubscribeReason = "NOT_RELEVANT" | "NO_REASON_GIVEN";

interface UnsubscribeEventData {
  subscriberId: Subscriber["id"];
  reason?: UnsubscribeReason;
}

export interface UnsubscribeEventProps
  extends DomainEventProps<UnsubscribeEventData> {}

export class UnsubscribeEvent extends DomainEvent<UnsubscribeEventData> {
  public static record(data: UnsubscribeEventData) {
    return new UnsubscribeEvent({ data });
  }

  public static of(props: UnsubscribeEventProps) {
    return new UnsubscribeEvent(props);
  }
  private constructor(props: UnsubscribeEventProps) {
    super(props);
  }
}
