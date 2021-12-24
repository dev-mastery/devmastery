import {
  Id,
  DomainEvent,
  PositiveInteger,
  DomainEventProps,
} from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface SubscribedEventData {
  subscriberId: Subscriber["id"];
  email: Subscriber["email"];
  name?: Subscriber["name"];
  verificationCode: Subscriber["verificationCode"];
  version: Subscriber["version"];
}

export interface SubscribedEventProps
  extends DomainEventProps<SubscribedEventData> {}

export class SubscribedEvent extends DomainEvent<SubscribedEventData> {
  public static record(data: SubscribedEventData) {
    let aggregateId = data.subscriberId;
    let eventId = Id.next();
    let occurredAt = new Date();
    let ordinal = PositiveInteger.of(data.version);
    return new SubscribedEvent({
      aggregateId,
      data,
      eventId,
      occurredAt,
      ordinal,
    });
  }

  public static of(props: SubscribedEventProps) {
    return new SubscribedEvent(props);
  }

  private constructor(props: SubscribedEventProps) {
    super(props);
  }
}
