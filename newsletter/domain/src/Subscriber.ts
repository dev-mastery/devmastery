import { VerificationCode, Aggregate } from "@devmastery/common-domain";
import type {
  EmailAddress,
  NonEmptyString,
  Id,
} from "@devmastery/common-domain";
import { SubscribeEvent } from "./SubscribeEvent";
import { ConfirmationEvent } from "./ConfirmationEvent";
import { UnsubscribeEvent } from "./UnsubscribeEvent";
import { UnsubscribeReason } from "./UnsubscribeReason";
import { FirstNameChangedEvent } from "./FirstNameChangedEvent";

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "cancelled"
  | "unverified";
export type SubscriberEvents = Array<
  SubscribeEvent | ConfirmationEvent | UnsubscribeEvent
>;

export class Subscriber extends Aggregate {
  #firstName?: NonEmptyString;
  #email: EmailAddress;
  #validatedEmail?: EmailAddress;
  #verificationCode: VerificationCode;
  #unsubscribeReason?: UnsubscribeReason;
  #subscriptionStatus: SubscriptionStatus = "pending";

  public static of({
    id,
    email,
  }: {
    id: Subscriber["id"];
    email: Subscriber["email"];
  }): Subscriber {
    return new Subscriber({ id, email });
  }

  public static fromHistory({
    events,
  }: {
    events: Readonly<SubscriberEvents>;
  }) {
    if (!(events[0] instanceof SubscribeEvent)) {
      throw new Error("The first historical event must be a SubscribeEvent");
    }

    const id = events[0].data.subscriberId;
    const email = events[0].data.email;
    const subscriber = new Subscriber({ id, email });
    events.forEach((event) => subscriber.applyEvent(event));
    return subscriber;
  }

  public unsubscribe({ reason }: { reason?: UnsubscribeReason } = {}) {
    const event = UnsubscribeEvent.record({ subscriberId: this.id, reason });
    this.captureEvent(event);
  }

  public confirmSubscription({
    id,
    verificationCode,
  }: {
    id: Subscriber["id"];
    verificationCode: Subscriber["verificationCode"];
  }): void {
    const event = ConfirmationEvent.record({
      subscriberId: id,
      verificationCode,
    });
    this.captureEvent(event);
  }

  public changeFirstName({ newFirstName }: { newFirstName: NonEmptyString }) {
    const event = FirstNameChangedEvent.record({
      subscriberId: this.id,
      newFirstName,
    });
    this.captureEvent(event);
  }

  private constructor({
    id,
    email,
    version,
  }: {
    id: Id;
    email: Subscriber["email"];
    version?: Subscriber["version"];
  }) {
    super({ id, version });
    this.#email = email;
    this.#verificationCode = VerificationCode.next();
  }

  public subscribe(props?: { firstName: Subscriber["firstName"] }) {
    let alreadySubscribed = this.subscriptionStatus === "active";
    let nameChanged =
      props && props.firstName && !this.#firstName?.equals(props.firstName);

    if (!alreadySubscribed) {
      let subscribeEvent = SubscribeEvent.record({
        subscriberId: this.id,
        email: this.email,
        firstName: props?.firstName,
        verificationCode: this.verificationCode,
      });
      this.captureEvent(subscribeEvent);
    } else if (nameChanged) {
      this.captureEvent(
        FirstNameChangedEvent.record({
          subscriberId: this.id,
          newFirstName: props?.firstName,
        })
      );
    }
  }

  protected applyEvent(event: SubscriberEvents[number]) {
    if (!event.data.subscriberId.equals(this.id)) {
      throw new Error("Event belongs to a different subscriber.");
    }
    if (event instanceof SubscribeEvent) {
      this.onSubscribe(event);
    }
    if (event instanceof ConfirmationEvent) {
      this.onConfirmation(event);
    }
    if (event instanceof UnsubscribeEvent) {
      this.onUnsubscribe(event);
    }
    if (event instanceof FirstNameChangedEvent) {
      this.onFirstNameChanged(event);
    }
  }

  public get firstName() {
    return this.#firstName;
  }

  public get email(): EmailAddress {
    return this.#email;
  }

  public get subscriptionStatus(): SubscriptionStatus {
    return this.#subscriptionStatus;
  }

  public get unsubscribeReason() {
    return this.#unsubscribeReason;
  }

  public get verificationCode() {
    return this.#verificationCode;
  }

  public get validatedEmail() {
    return this.#validatedEmail;
  }

  public toJSON() {
    return {
      id: this.id.valueOf(),
      firstName: this.firstName?.valueOf(),
      email: this.email.valueOf(),
      validatedEmail: this.validatedEmail?.valueOf(),
      subscriptionStatus: this.subscriptionStatus.valueOf(),
      version: this.version.valueOf(),
      verificationCode: this.verificationCode.valueOf(),
    };
  }

  private onSubscribe(event: SubscribeEvent) {
    this.#email = event.data.email;
    this.#verificationCode = event.data.verificationCode;
    this.#firstName = event.data.firstName;
    this.#subscriptionStatus = "pending";
    this.incrementVersion();
  }

  private onConfirmation(event: ConfirmationEvent) {
    if (this.subscriptionStatus === "active") {
      return;
    }

    const { verificationCode } = event.data;

    if (!verificationCode.equals(this.verificationCode)) {
      throw new Error("Incorrect verification code.");
    }

    this.#validatedEmail = this.#email;
    this.#subscriptionStatus = "active";
    this.incrementVersion();
  }

  private onFirstNameChanged(event: FirstNameChangedEvent) {
    this.#subscriptionStatus = "pending";
    this.#firstName = event.data.newFirstName;
    this.incrementVersion();
  }

  private onUnsubscribe(event: UnsubscribeEvent) {
    if (this.subscriptionStatus === "cancelled") {
      return;
    }
    this.#subscriptionStatus = "cancelled";
    this.#unsubscribeReason =
      event.data.reason ?? UnsubscribeReason.NO_REASON_GIVEN;
    this.incrementVersion();
  }
}
