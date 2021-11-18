import * as Faker from "faker";
import { Subscriber } from "./Subscriber";
import {
  EmailAddress,
  Id,
  NonEmptyString,
  PositiveInteger,
  VerificationCode,
} from "@devmastery/common-domain";
import { SubscribeEvent } from "./SubscribeEvent";
import { UnsubscribeEvent } from "./UnsubscribeEvent";
import { ConfirmationEvent, FirstNameChangedEvent } from ".";
import { UnsubscribeReason } from "./UnsubscribeReason";

describe("Subscriber", () => {
  it("subscribes with a first name and an email address", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
    expect(subscriber).toBeDefined();
    expect(subscriber.email).toEqual(email);
    expect(subscriber.firstName).toEqual(firstName);
    expect(subscriber.id).toEqual(id);
    expect(subscriber.version.value).toBe(2);
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.verificationCode).toBeDefined();
    expect(subscriber.events.length).toBe(1);
    expect(subscriber.events[0]).toBeInstanceOf(SubscribeEvent);
  });

  it("subscribes with an email address only", () => {
    let id = Id.next();
    let email = EmailAddress.of(Faker.internet.email());

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe();
    expect(subscriber).toBeDefined();
    expect(subscriber.email).toEqual(email);
    expect(subscriber.firstName).toBeUndefined();
    expect(subscriber.id).toEqual(id);
    expect(subscriber.version.value).toBe(2);
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.verificationCode).toBeDefined();
    expect(subscriber.events.length).toBe(1);
    expect(subscriber.events[0]).toBeInstanceOf(SubscribeEvent);
  });

  it("rescribes with the same firstName", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
    expect(subscriber.subscriptionStatus).toBe("pending");
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.version).toEqual(PositiveInteger.of(3));

    subscriber.subscribe({ firstName });
    // version and status should remain unchanged since nothing changed.
    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.version).toEqual(PositiveInteger.of(3));
  });

  it("re-subscribes with a different firstName", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    // version 1
    let subscriber = Subscriber.of({
      id,
      email,
    });

    // version 2
    subscriber.subscribe();
    expect(subscriber.subscriptionStatus).toBe("pending");

    // version 3
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });
    expect(subscriber.subscriptionStatus).toBe("active");

    // version 4
    subscriber.subscribe({ firstName });
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.version).toEqual(PositiveInteger.of(4));
  });

  it("changes its first name", () => {
    let id = Id.next();
    let email = EmailAddress.of(Faker.internet.email());

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe();
    let newFirstName = NonEmptyString.of(Faker.name.firstName());
    subscriber.changeFirstName({ newFirstName });
    expect(subscriber.firstName).toEqual(newFirstName);
    expect(subscriber.events[1]).toBeInstanceOf(FirstNameChangedEvent);
  });

  it("confirms the subscription successfully", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
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
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    expect(subscriber.subscriptionStatus).toBe("pending");

    expect(() =>
      subscriber.confirmSubscription({
        id: subscriber.id,
        verificationCode: VerificationCode.next(),
      })
    ).toThrowError();
  });

  it("unsubscribes with no reason", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe();
    subscriber.unsubscribe();
    expect(subscriber.subscriptionStatus).toBe("cancelled");
    expect(subscriber.events[1]).toBeInstanceOf(UnsubscribeEvent);
  });

  it("unsubscribes with a reason", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
    subscriber.unsubscribe({ reason: UnsubscribeReason.NOT_RELEVANT });

    expect(subscriber.subscriptionStatus).toBe("cancelled");
    expect(subscriber.events[1]).toBeInstanceOf(UnsubscribeEvent);
  });

  it("is idempotent", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
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
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let original = Subscriber.of({
      id,
      email,
    });
    original.subscribe({ firstName });
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
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
    const asJSON = () => ({
      id: subscriber.id.valueOf(),
      firstName: subscriber.firstName?.valueOf(),
      email: subscriber.email.valueOf(),
      validatedEmail: subscriber.validatedEmail?.valueOf(),
      subscriptionStatus: subscriber.subscriptionStatus.valueOf(),
      version: subscriber.version.valueOf(),
      verificationCode: subscriber.verificationCode.valueOf(),
    });
    expect(subscriber.toJSON()).toStrictEqual(asJSON());

    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });

    expect(subscriber.toJSON()).toStrictEqual(asJSON());

    let unnamedSubscriber = Subscriber.of({
      id,
      email,
    });

    expect(unnamedSubscriber.toJSON()).toStrictEqual({
      id: unnamedSubscriber.id.valueOf(),
      firstName: unnamedSubscriber.firstName?.valueOf(),
      email: unnamedSubscriber.email.value,
      validatedEmail: unnamedSubscriber.validatedEmail?.valueOf(),
      subscriptionStatus: unnamedSubscriber.subscriptionStatus.valueOf(),
      version: unnamedSubscriber.version.valueOf(),
      verificationCode: unnamedSubscriber.verificationCode.valueOf(),
    });
  });

  it("prevents recreation from incomplete history", () => {
    let id = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));
    let subscriber = Subscriber.of({
      id,
      email,
    });
    subscriber.subscribe({ firstName });
    subscriber.confirmSubscription({
      id: subscriber.id,
      verificationCode: subscriber.verificationCode,
    });

    expect(() =>
      Subscriber.fromHistory({ events: subscriber.events.slice(1) })
    ).toThrowError();
  });

  it("prevents recreation from foreign events", () => {
    let id = Id.next();
    let email = EmailAddress.of(Faker.internet.email());
    let subscriber = Subscriber.of({
      id,
      email,
    });

    let event = ConfirmationEvent.record({
      subscriberId: Id.next(),
      verificationCode: subscriber.verificationCode,
    });
    subscriber.subscribe();
    expect(() =>
      Subscriber.fromHistory({ events: [...subscriber.events, event] })
    ).toThrowError();
  });
});
