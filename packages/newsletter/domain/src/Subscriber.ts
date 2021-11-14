import {
  PositiveInteger,
  VerificationCode,
  Aggregate,
  DomainEvent,
} from "@devmastery/common-domain";
import type {
  EmailAddress,
  NonEmptyString,
  Id,
} from "@devmastery/common-domain";
import { SubscribeEvent } from "./SubscribeEvent";
import { ConfirmationEvent } from "./ConfirmationEvent";
import { UnsubscribeEvent } from "./UnsubscribeEvent";

type SubscriptionStatus = "active" | "pending" | "cancelled";
type SubscriberEvents = Array<
  SubscribeEvent | ConfirmationEvent | UnsubscribeEvent
>;

interface SubscriberSnapshot {
  id: Id;
  firstName?: NonEmptyString;
  email: EmailAddress;
  validatedEmail?: EmailAddress;
  subscriptionStatus: SubscriptionStatus;
  version: PositiveInteger;
  verificationCode: VerificationCode;
}

export class Subscriber extends Aggregate {
  #firstName?: NonEmptyString;
  #email: EmailAddress;
  #subscriptionStatus: SubscriptionStatus = "pending";
  #validatedEmail?: EmailAddress;
  #verificationCode: VerificationCode = VerificationCode.next();

  public static subscribe({
    subscriberId,
    firstName,
    email,
  }: Omit<SubscribeEvent["data"], "verificationCode">): Subscriber {
    const newSubscriber = new Subscriber({ id: subscriberId, email });
    newSubscriber.subscribe({ subscriberId, firstName, email });
    return newSubscriber;
  }

  public static fromHistory({
    events,
    snapshot,
  }: {
    events: Readonly<SubscriberEvents>;
    snapshot?: SubscriberSnapshot;
  }) {
    if (snapshot == null && !(events[0] instanceof SubscribeEvent)) {
      throw new Error(
        "When no snapshot is provided, the first historical event must be a SubscribeEvent"
      );
    }

    const id = snapshot?.id ?? events[0].data.subscriberId;
    const email = snapshot?.email ?? (events[0] as SubscribeEvent).data.email;
    const version = snapshot?.version;
    const subscriber = new Subscriber({ id, email, version });
    subscriber.hydrate({ events, snapshot });
    return subscriber;
  }

  public static fromSnapshot(snapshot: SubscriberSnapshot) {
    const subscriber = new Subscriber({
      id: snapshot.id,
      email: snapshot.email,
      version: snapshot.version,
    });
    subscriber.hydrate({ snapshot });
    return subscriber;
  }

  private subscribe(props: Omit<SubscribeEvent["data"], "verificationCode">) {
    const event = SubscribeEvent.record({
      ...props,
      verificationCode: this.verificationCode,
    });
    this.captureEvent(event);
  }

  public unsubscribe() {
    const event = UnsubscribeEvent.record({ subscriberId: this.id });
    this.captureEvent(event);
  }

  public confirmSubscription({
    id,
    email,
    verificationCode,
  }: {
    id: Subscriber["id"];
    email: Subscriber["email"];
    verificationCode: Subscriber["verificationCode"];
  }): void {
    const event = ConfirmationEvent.record({
      subscriberId: id,
      email,
      verificationCode,
    });
    this.captureEvent(event);
  }

  private constructor({
    id,
    email,
    version,
  }: {
    id: Id;
    email: EmailAddress;
    version?: PositiveInteger;
  }) {
    super({ id, version });
    this.#email = email;
  }

  private hydrate(props: {
    events?: Readonly<SubscriberEvents>;
    snapshot?: SubscriberSnapshot;
  }) {
    const { events, snapshot } = props ?? {};

    if (snapshot != null) {
      this.applySnapshot(snapshot);
    }

    events?.forEach((e) => this.applyEvent(e));
  }

  private applySnapshot(snapshot: SubscriberSnapshot) {
    this.#firstName = snapshot.firstName;
    this.#email = snapshot.email;
    this.#subscriptionStatus = snapshot.subscriptionStatus;
    this.#verificationCode = snapshot.verificationCode;
    this.#validatedEmail = snapshot.validatedEmail;
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
  }

  public get firstName() {
    return this.#firstName;
  }

  public get email(): EmailAddress {
    return this.#email;
  }

  public get subscriptionStatus() {
    return this.#subscriptionStatus;
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
    if (this.version.value > 1) {
      throw Error("An existing Subscriber cannot re-subscribe.");
    }

    this.#subscriptionStatus = "pending";
    this.#email = event.data.email;
    this.#firstName = event.data.firstName;
    this.#verificationCode = event.data.verificationCode;
  }

  private onConfirmation(event: ConfirmationEvent) {
    const { email, verificationCode } = event.data;
    if (!this.email || !email.equals(this.email)) {
      throw new Error("Email mismatch.");
    }
    if (
      !this.verificationCode ||
      !verificationCode?.equals(this.verificationCode)
    ) {
      throw new Error("Incorrect confirmation code.");
    }

    this.#validatedEmail = event.data.email;
    this.#subscriptionStatus = "active";
  }

  private onUnsubscribe(event: UnsubscribeEvent) {
    if (event.data.subscriberId.equals(this.id)) {
      this.#subscriptionStatus = "cancelled";
    }
  }
}
