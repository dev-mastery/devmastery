import { EmailAddress, Id, NonEmptyString } from "@devmastery/common-domain";
import { Subscriber, SubscriberEvents } from "@devmastery/newsletter-domain";

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): Promise<void>;
}

interface SubscriberRepo {
  findByEmail(email: EmailAddress): Promise<Subscriber>;
}

interface SubscribeInfo {
  id: string;
  email: string;
  firstName?: string;
}

export function makeSubscribe({
  publisher,
  repo,
}: {
  publisher: SubscriberEventPublisher;
  repo: SubscriberRepo;
}) {
  return async function subscribe(info: SubscribeInfo) {
    let email = EmailAddress.of(info.email);
    let id = Id.of(info.id);
    let firstName = info.firstName
      ? NonEmptyString.of(info.firstName)
      : undefined;

    let existingSubscriber = await repo.findByEmail(email);
    let subscriber =
      existingSubscriber ??
      Subscriber.of({
        id,
        email,
      });
    subscriber.subscribe({ firstName });
    publisher.publish(subscriber.events);
  };
}

function isAlreadySubscribed(subscriber?: Subscriber) {
  return subscriber && subscriber.subscriptionStatus === "active";
}

function isNewFirstName(
  subscriber: Subscriber,
  firstName: Subscriber["firstName"]
) {
  return Boolean(firstName && !subscriber.firstName?.equals(firstName));
}
