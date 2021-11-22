import { DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

interface SubscriptionConfirmedEventData {
  subscriberId: Subscriber["id"];
  verificationCode: Subscriber["verificationCode"];
}
interface SubscriptionConfirmedEventProps
  extends DomainEventProps<SubscriptionConfirmedEventData> {}

export class SubscriptionConfirmedEvent extends DomainEvent<SubscriptionConfirmedEventData> {
  public static of(props: SubscriptionConfirmedEventProps) {
    return new SubscriptionConfirmedEvent(props);
  }

  public static record(data: SubscriptionConfirmedEventData) {
    return new SubscriptionConfirmedEvent({ data });
  }

  private constructor(props: SubscriptionConfirmedEventProps) {
    super(props);
  }
}
