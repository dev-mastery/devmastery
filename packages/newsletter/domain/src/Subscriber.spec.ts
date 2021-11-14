import * as Faker from "faker";
import { Subscriber } from "./Subscriber";
import { EmailAddress, Id, NonEmptyString } from "@devmastery/common-domain";
import { SubscribeEvent } from "./SubscribeEvent";
import { UnsubscribeEvent } from "./UnsubscribeEvent";
import { ConfirmationEvent } from ".";

describe("Subscriber", () => {
  it("subscribes", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    expect(subscriber).toBeDefined();
    expect(subscriber.email).toEqual(email);
    expect(subscriber.firstName).toEqual(firstName);
    expect(subscriber.id).toEqual(subscriberId);
    expect(subscriber.version.value).toBe(2);
    expect(subscriber.subscriptionStatus).toBe("pending");
    expect(subscriber.verificationCode).toBeDefined();
    expect(subscriber.events.length).toBe(1);
    expect(subscriber.events[0]).toBeInstanceOf(SubscribeEvent);
  });

  it("confirms the subscription", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });
    expect(subscriber.subscriptionStatus).toBe("pending");

    subscriber.confirmSubscription({
      id: subscriber.id,
      email: subscriber.email,
      verificationCode: subscriber.verificationCode,
    });

    expect(subscriber.subscriptionStatus).toBe("active");
    expect(subscriber.validatedEmail).toEqual(email);
  });

  it("unsubscribes", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    subscriber.unsubscribe();
    expect(subscriber.subscriptionStatus).toBe("cancelled");
    expect(subscriber.events[1]).toBeInstanceOf(UnsubscribeEvent);
  });

  it("recreates from snapshot", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let original = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    let restored = Subscriber.fromSnapshot({
      id: original.id,
      verificationCode: original.verificationCode,
      email: original.email,
      firstName: original.firstName,
      validatedEmail: original.validatedEmail,
      subscriptionStatus: original.subscriptionStatus,
      version: original.version,
    });
    expect(restored).toEqual(original);
  });

  it("recreates from history", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let original = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    original.confirmSubscription({
      id: original.id,
      email: original.email,
      verificationCode: original.verificationCode,
    });

    let restored = Subscriber.fromHistory({ events: original.events });
    expect(restored).toEqual(original);
    expect(restored.events.length).toBe(0);
  });

  it("recreates from snapshot and history", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let original = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    let snapshot = original;

    let initialRestore = Subscriber.fromSnapshot(snapshot);
    initialRestore.confirmSubscription({
      id: snapshot.id,
      email: snapshot.email,
      verificationCode: snapshot.verificationCode,
    });

    let nextRestore = Subscriber.fromHistory({
      events: initialRestore.events,
      snapshot,
    });

    expect(nextRestore).toEqual(initialRestore);
  });

  it("serializes to JSON", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));

    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

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
      email: subscriber.email,
      verificationCode: subscriber.verificationCode,
    });

    expect(subscriber.toJSON()).toStrictEqual(asJSON());
  });

  it("prevents recreation from incomplete history", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email(firstName.valueOf()));
    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    subscriber.confirmSubscription({
      id: subscriber.id,
      email: subscriber.email,
      verificationCode: subscriber.verificationCode,
    });
    expect(() =>
      Subscriber.fromHistory({ events: subscriber.events.slice(1) })
    ).toThrowError();
  });

  it("prevents recreation from foreign events", () => {
    let subscriberId = Id.next();
    let firstName = NonEmptyString.of(Faker.name.firstName());
    let email = EmailAddress.of(Faker.internet.email());
    let subscriber = Subscriber.subscribe({
      subscriberId,
      email,
      firstName,
    });

    let event = ConfirmationEvent.record({
      subscriberId: Id.next(),
      email: subscriber.email,
      verificationCode: subscriber.verificationCode,
    });

    expect(() =>
      Subscriber.fromHistory({ events: [...subscriber.events, event] })
    ).toThrowError();
  });
});
