import {
  DomainEvent,
  DomainEventProps,
  Id,
  PositiveInteger,
} from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface NameChangedEventData {
  subscriberId: Subscriber["id"];
  newName: Subscriber["name"];
  version: Subscriber["version"];
}

export interface NameChangedEventProps
  extends DomainEventProps<NameChangedEventData> {}

export class NameChangedEvent extends DomainEvent<NameChangedEventData> {
  public static record(data: NameChangedEventData) {
    let aggregateId = data.subscriberId;
    let eventId = Id.next();
    let occurredAt = new Date();
    let ordinal = PositiveInteger.of(data.version);
    return new NameChangedEvent({
      aggregateId,
      data,
      eventId,
      occurredAt,
      ordinal,
    });
  }

  public static of(props: NameChangedEventProps) {
    return new NameChangedEvent(props);
  }

  private constructor(props: NameChangedEventProps) {
    super(props);
  }
}
