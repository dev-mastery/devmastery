import { DomainEvent } from "@devmastery/common-domain";
import type { DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface FirstNameChangedEventData {
  subscriberId: Subscriber["id"];
  newFirstName: Subscriber["firstName"];
}

interface FirstNameChangedEventProps
  extends DomainEventProps<FirstNameChangedEventData> {}

export class FirstNameChangedEvent extends DomainEvent<FirstNameChangedEventData> {
  public static record(data: FirstNameChangedEventData) {
    return new FirstNameChangedEvent({ data });
  }

  public static of(props: FirstNameChangedEventProps) {
    return new FirstNameChangedEvent(props);
  }

  private constructor(props: FirstNameChangedEventProps) {
    super(props);
  }
}
