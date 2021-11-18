import { DomainEvent, DomainEventProps } from "@devmastery/common-domain";
import type { Subscriber } from "./Subscriber";

interface ConfirmationEventData {
  subscriberId: Subscriber["id"];
  verificationCode: Subscriber["verificationCode"];
}
interface ConfirmationEventProps
  extends DomainEventProps<ConfirmationEventData> {}

export class ConfirmationEvent extends DomainEvent<ConfirmationEventData> {
  public static of(props: ConfirmationEventProps) {
    return new ConfirmationEvent(props);
  }

  public static record(data: ConfirmationEventData) {
    return new ConfirmationEvent({ data });
  }

  private constructor(props: ConfirmationEventProps) {
    super(props);
  }
}
