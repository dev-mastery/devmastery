import { DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

interface UnsubscribeEventData {
  subscriberId: Subscriber["id"];
  reason?: Subscriber["unsubscribeReason"];
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
