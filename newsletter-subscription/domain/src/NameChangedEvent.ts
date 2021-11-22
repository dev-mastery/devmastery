import { DomainEvent } from "@devmastery/common-domain";
import type { DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface NameChangedEventData {
  subscriberId: Subscriber["id"];
  newName: Subscriber["name"];
}

interface NameChangedEventProps
  extends DomainEventProps<NameChangedEventData> {}

export class NameChangedEvent extends DomainEvent<NameChangedEventData> {
  public static record(data: NameChangedEventData) {
    return new NameChangedEvent({ data });
  }

  public static of(props: NameChangedEventProps) {
    return new NameChangedEvent(props);
  }

  private constructor(props: NameChangedEventProps) {
    super(props);
  }
}
