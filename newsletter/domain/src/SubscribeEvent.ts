import { DomainEvent } from "@devmastery/common-domain";
import type { DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

export interface SubscribeEventData {
  subscriberId: Subscriber["id"];
  email: Subscriber["email"];
  firstName?: Subscriber["firstName"];
  verificationCode: Subscriber["verificationCode"];
}

interface SubscribeEventProps extends DomainEventProps<SubscribeEventData> {}

export class SubscribeEvent extends DomainEvent<SubscribeEventData> {
  public static record(data: SubscribeEventData) {
    return new SubscribeEvent({ data });
  }

  public static of(props: SubscribeEventProps) {
    return new SubscribeEvent(props);
  }

  private constructor(props: SubscribeEventProps) {
    super(props);
  }
}
