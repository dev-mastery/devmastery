import { DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

interface UnsubscribedEventData {
  subscriberId: Subscriber["id"];
  reason?: Subscriber["unsubscribeReason"];
}

export interface UnsubscribedEventProps
  extends DomainEventProps<UnsubscribedEventData> {}

export class UnsubscribedEvent extends DomainEvent<UnsubscribedEventData> {
  public static record(data: UnsubscribedEventData) {
    return new UnsubscribedEvent({ data });
  }

  public static of(props: UnsubscribedEventProps) {
    return new UnsubscribedEvent(props);
  }
  private constructor(props: UnsubscribedEventProps) {
    super(props);
  }
}
