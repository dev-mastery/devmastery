import { Id, DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "../entities/Subscriber";

export interface SubscribedEventdata {
  subscriberId: Subscriber["id"];
  email: Subscriber["email"];
  name?: Subscriber["name"];
  verificationCode: Subscriber["verificationCode"];
  version: Subscriber["version"];
}

export interface SubscribedEventProps
  extends DomainEventProps<SubscribedEventdata> {}

export class SubscribedEvent extends DomainEvent<SubscribedEventdata> {
  public static record(data: SubscribedEventdata) {
    let aggregateId = data.subscriberId;
    let eventId = Id.next();
    let occurredAt = new Date();
    let aggregateVersion = data.version;
    return new SubscribedEvent({
      aggregateId,
      aggregateVersion,
      data,
      eventId,
      occurredAt,
    });
  }

  public static of(props: SubscribedEventProps) {
    return new SubscribedEvent(props);
  }

  private constructor(props: SubscribedEventProps) {
    super(props);
  }
}
