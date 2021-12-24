import * as Faker from "faker";
import {
  BadFirstEventError,
  ForeignEventError,
  Subscriber,
  WrongVerificationCodeError,
} from "./Subscriber";
import {
  EmailAddress,
  Id,
  Name,
  PositiveInteger,
  VerificationCode,
} from "@devmastery/common-domain";
import { SubscribedEvent } from "../events/SubscribedEvent";
import { UnsubscribedEvent } from "../events/UnsubscribedEvent";
import { SubscriptionConfirmedEvent } from "../events/SubscriptionConfirmedEvent";
import { NameChangedEvent } from "../events/NameChangedEvent";
import { UnsubscribeReason } from "./UnsubscribeReason";

describe("Subscriber", () => {
  it("subscribes with a name and an email address", () => {
    let id = Id.next();
    let name = Name.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    expect(subscriber).toBeDefined();
    expect(subscriber.email).toEqual(email);
    expect(subscriber.name).toEqual(name);
    expect(subscriber.id).toEqual(id);
    expect(subscriber.version.value).toBe(2);
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.verificationCode).toBeDefined();
    expect(subscriber.events.length).toBe(1);
    expect(subscriber.events[0]).toBeInstanceOf(SubscribedEvent);
  });

  it("subscribes with an email address only", () => {
    let id = Id.next();

    let email = EmailAddress.of(Faker.internet.email());
    let subscriber = Subscriber.subscribe({ id, email });

    expect(subscriber).toBeDefined();
    expect(subscriber.email).toEqual(email);
    expect(subscriber.name).toBeUndefined();
    expect(subscriber.id).toEqual(id);
    expect(subscriber.version.value).toBe(2);
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.verificationCode).toBeDefined();
    expect(subscriber.events.length).toBe(1);
    expect(subscriber.events[0]).toBeInstanceOf(SubscribedEvent);
  });

  it("rescribes with the same firstName", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    expect(subscriber.subscriptionStatus).toBe("pending");
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.version).toEqual(PositiveInteger.of(3));

    subscriber.subscribe({ name });
    // version and status should remain unchanged since nothing changed.
    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.version).toEqual(PositiveInteger.of(3));
  });

  it("re-subscribes with a different firstName", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });
    expect(subscriber.subscriptionStatus).toBe("pending");

    // version 3
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    expect(subscriber.subscriptionStatus).toBe("active");

    // version 4
    subscriber.subscribe({
      name: SubscriberName.firstNameOnly(Faker.name.firstName()),
    });
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.version).toEqual(PositiveInteger.of(4));
  });

  it("changes its first name", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    let newName = SubscriberName.firstNameOnly(Faker.name.firstName());
    subscriber.changeName({ newName });
    expect(subscriber.name).toEqual(newName);
    expect(subscriber.events[1]).toBeInstanceOf(NameChangedEvent);
  });

  it("does not overwrite an existing first name when re-subscribing", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    subscriber.confirmSubscription({
      id,
      verificationCode: subscriber.verificationCode,
    });
    subscriber.subscribe({ name: undefined });
    expect(subscriber.name).toEqual(name);
  });

  it("confirms the subscription successfully", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    expect(subscriber.subscriptionStatus).toBe("pending");

    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });

    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.validatedEmail).toEqual(email);
  });

  it("fails to confirm the subscription when the verification code is invalid", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    expect(subscriber.subscriptionStatus).toBe("pending");

    expect(() =>
      subscriber.confirmSubscription({
        id: subscriber.id,
        verificationCode: VerificationCode.next(),
      })
    ).toThrowError(WrongVerificationCodeError);
  });

  it("unsubscribes with no reason", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    subscriber.unsubscribe();
    expect(subscriber.subscriptionStatus).toBe("cancelled");
    expect(subscriber.events[1]).toBeInstanceOf(UnsubscribedEvent);
  });

  it("unsubscribes with a reason", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    subscriber.unsubscribe({ reason: UnsubscribeReason.NOT_RELEVANT });

    expect(subscriber.subscriptionStatus).toBe("cancelled");
    expect(subscriber.events[1]).toBeInstanceOf(UnsubscribedEvent);
    expect(subscriber.unsubscribeReason).toStrictEqual(
      UnsubscribeReason.NOT_RELEVANT
    );
  });

  it("is idempotent", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });
    let subscribedVersion = subscriber.version.value;

    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    let confirmedVersion = subscriber.version.value;
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    let confirmedAgainVersion = subscriber.version.value;

    subscriber.unsubscribe();
    let unsubscribeVersion = subscriber.version.value;
    subscriber.unsubscribe();
    let unsubscribeAgainVersion = subscriber.version.value;

    expect(subscribedVersion).not.toBe(confirmedVersion);
    expect(confirmedAgainVersion).toBe(confirmedVersion);
    expect(confirmedVersion).not.toBe(unsubscribeVersion);
    expect(unsubscribeVersion).toBe(unsubscribeAgainVersion);
  });

  it("recreates from history", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let original = Subscriber.subscribe({ id, name, email });

    original.confirmSubscription({
      id: original.id,
      verificationCode: original.verificationCode,
    });

    let restored = Subscriber.fromHistory({ events: original.events });
    expect(restored).toEqual(original);
    expect(restored.events.length).toBe(0);
  });

  it("serializes to JSON", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    const asJSON = () => ({
      id: subscriber.id.value,
      name: {
        firstName: subscriber.name?.firstName,
        lastName: subscriber.name?.lastName,
      },
      email: subscriber.email.value,
      validatedEmail: subscriber.validatedEmail?.value,
      subscriptionStatus: subscriber.subscriptionStatus,
      version: subscriber.version.value,
      verificationCode: subscriber.verificationCode.value,
    });
    expect(subscriber.toJSON()).toStrictEqual(asJSON());

    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });

    expect(subscriber.toJSON()).toStrictEqual(asJSON());

    let unnamedSubscriber = Subscriber.subscribe({
      id,
      email,
    });

    expect(unnamedSubscriber.toJSON()).toStrictEqual({
      id: unnamedSubscriber.id.value,
      name: unnamedSubscriber.name?.toJSON(),
      email: unnamedSubscriber.email.value,
      validatedEmail: unnamedSubscriber.validatedEmail?.value,
      subscriptionStatus: unnamedSubscriber.subscriptionStatus,
      version: unnamedSubscriber.version.value,
      verificationCode: unnamedSubscriber.verificationCode.value,
    });
  });

  it("prevents recreation from incomplete history", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });

    expect(() =>
      Subscriber.fromHistory({ events: subscriber.events.slice(1) })
    ).toThrowError(BadFirstEventError);
  });

  it("prevents recreation from foreign events", () => {
    let id = Id.next();
    let name = SubscriberName.firstNameOnly(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(name.firstName));
    let subscriber = Subscriber.subscribe({ id, name, email });

    let event = SubscriptionConfirmedEvent.record({
      subscriberId: Id.next(),
      verificationCode: subscriber.verificationCode,
    });
    subscriber.subscribe();
    expect(() =>
      Subscriber.fromHistory({ events: [...subscriber.events, event] })
    ).toThrowError(ForeignEventError);
  });
});
