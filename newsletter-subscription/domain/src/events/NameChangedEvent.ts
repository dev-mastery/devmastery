import { DomainEvent, DomainEventProps, Id } from "@devmastery/common-domain";
import type { Subscriber } from "../entities/Subscriber";

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
    let aggregateVersion = data.version;
    return new NameChangedEvent({
      aggregateId,
      data,
      eventId,
      occurredAt,
      aggregateVersion,
    });
  }

  public static of(props: NameChangedEventProps) {
    return new NameChangedEvent(props);
  }

  private constructor(props: NameChangedEventProps) {
    super(props);
  }
}
