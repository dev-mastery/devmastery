import { DomainEvent } from "@devmastery/common-domain";
import type { DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface SubscribedEventData {
  subscriberId: Subscriber["id"];
  email: Subscriber["email"];
  name?: Subscriber["name"];
  verificationCode: Subscriber["verificationCode"];
}

interface SubscribedEventProps extends DomainEventProps<SubscribedEventData> {}

export class SubscribedEvent extends DomainEvent<SubscribedEventData> {
  public static record(data: SubscribedEventData) {
    return new SubscribedEvent({ data });
  }

  public static of(props: SubscribedEventProps) {
    return new SubscribedEvent(props);
  }

  private constructor(props: SubscribedEventProps) {
    super(props);
  }
}
