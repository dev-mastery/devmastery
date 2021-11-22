import {
  VerificationCode,
  Aggregate,
  EmailAddress,
  Id,
  Name,
} from "@devmastery/common-domain";
import { SubscribedEvent } from "./SubscribedEvent";
import { SubscriptionConfirmedEvent } from "./SubscriptionConfirmedEvent";
import { UnsubscribedEvent } from "./UnsubscribedEvent";
import { UnsubscribeReason } from "./UnsubscribeReason";
import { NameChangedEvent } from "./NameChangedEvent";

export interface SubscribeCommand {
  id: string;
  firstName?: string;
  email: string;
}

export type SubscriptionStatus =
  | "active"
  | "pending"
  | "cancelled"
  | "unverified";
export type SubscriberEvents = Array<
  SubscribedEvent | SubscriptionConfirmedEvent | UnsubscribedEvent
>;

export class Subscriber extends Aggregate {
  #name?: Name;
  #email: EmailAddress;
  #validatedEmail?: EmailAddress;
  #verificationCode: VerificationCode;
  #unsubscribeReason?: UnsubscribeReason;
  #subscriptionStatus: SubscriptionStatus = "pending";

  public static subscribe({
    id,
    email,
    name,
  }: {
    id: Id;
    email: EmailAddress;
    name?: Name;
  }) {
    let subscriber = new Subscriber({ id, email });

    subscriber.subscribe({ name });
    return subscriber;
  }

  public static fromHistory({
    events,
  }: {
    events: Readonly<SubscriberEvents>;
  }) {
    if (!(events[0] instanceof SubscribedEvent)) {
      throw new Error("The first historical event must be a SubscribedEvent");
    }

    const id = events[0].data.subscriberId;
    const email = events[0].data.email;
    const subscriber = new Subscriber({ id, email });
    events.forEach((event) => subscriber.applyEvent(event));
    return subscriber;
  }

  public unsubscribe({ reason }: { reason?: UnsubscribeReason } = {}) {
    if (this.subscriptionStatus === "cancelled") {
      return;
    }
    const event = UnsubscribedEvent.record({ subscriberId: this.id, reason });
    this.captureEvent(event);
  }

  public confirmSubscription({
    id,
    verificationCode,
  }: {
    id: Subscriber["id"];
    verificationCode: Subscriber["verificationCode"];
  }): void {
    if (this.subscriptionStatus === "active") {
      return;
    }

    if (!verificationCode.equals(this.verificationCode)) {
      throw new Error("Incorrect verification code.");
    }

    const event = SubscriptionConfirmedEvent.record({
      subscriberId: id,
      verificationCode,
    });
    this.captureEvent(event);
  }

  public changeName({ newName }: { newName: Subscriber["name"] }) {
    const event = NameChangedEvent.record({
      subscriberId: this.id,
      newName,
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

  public subscribe(props?: { name?: Subscriber["name"] }) {
    let alreadySubscribed = this.subscriptionStatus === "active";
    let nameChanged =
      props && props.name != null && !this.#name?.equals(props.name);

    if (!alreadySubscribed) {
      let subscribeEvent = SubscribedEvent.record({
        subscriberId: this.id,
        email: this.email,
        name: props?.name,
        verificationCode: this.verificationCode,
      });
      this.captureEvent(subscribeEvent);
    } else if (nameChanged) {
      this.captureEvent(
        NameChangedEvent.record({
          subscriberId: this.id,
          newName: props?.name,
        })
      );
    }
  }

  protected applyEvent(event: SubscriberEvents[number]) {
    let eventHappenedHere = event.data.subscriberId.equals(this.id);
    if (!eventHappenedHere) throw new ForeignEventError();

    if (event instanceof SubscribedEvent) {
      this.applySubscribe(event);
    }
    if (event instanceof SubscriptionConfirmedEvent) {
      this.applyConfirmation(event);
    }
    if (event instanceof UnsubscribedEvent) {
      this.applyUnsubscribe(event);
    }
    if (event instanceof NameChangedEvent) {
      this.onFirstNameChanged(event);
    }

    this.incrementVersion();
  }

  public get name() {
    return this.#name;
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
      id: this.id.value,
      name: this.name?.value,
      email: this.email.value,
      validatedEmail: this.validatedEmail?.value,
      subscriptionStatus: this.subscriptionStatus,
      version: this.version.value,
      verificationCode: this.verificationCode.value,
    };
  }

  private applySubscribe(event: SubscribedEvent) {
    this.#email = event.data.email;
    this.#verificationCode = event.data.verificationCode;
    this.#name = event.data.name;
    this.#subscriptionStatus = "pending";
  }

  private applyConfirmation(event: SubscriptionConfirmedEvent) {
    this.#validatedEmail = this.#email;
    this.#subscriptionStatus = "active";
  }

  private onFirstNameChanged(event: NameChangedEvent) {
    this.#subscriptionStatus = "pending";
    this.#name = event.data.newName;
  }

  private applyUnsubscribe(event: UnsubscribedEvent) {
    this.#subscriptionStatus = "cancelled";
    this.#unsubscribeReason =
      event.data.reason ?? UnsubscribeReason.NO_REASON_GIVEN;
    this.incrementVersion();
  }
}

class ForeignEventError extends RangeError {
  constructor() {
    super("Event occurred on a different subscriber.");
    this.name = "ForeignEventError";
  }
}