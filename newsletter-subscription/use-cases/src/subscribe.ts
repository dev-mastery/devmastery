import {
  EmailAddress,
  Id,
  Name,
  NonEmptyString,
} from "@devmastery/common-domain";
import {
  Subscriber,
  SubscriberEvents,
} from "@devmastery/newsletter-subscription-domain";

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): Promise<void>;
}

interface SubscriberEventsRepo {
  findByAttributes(attrs: { email: EmailAddress }): Promise<Subscriber>;
}

export interface SubscribeCommand {
  id: string;
  email: string;
  firstName?: string;
}

export function makeSubscribe({
  publisher,
  repo,
}: {
  publisher: SubscriberEventPublisher;
  repo: SubscriberEventsRepo;
}) {
  return async function subscribe(sub: SubscribeCommand) {
    let subscriber;
    let email = EmailAddress.of(sub.email);
    let existingSubscriber = await repo.findByAttributes({ email });

    if (existingSubscriber) {
      subscriber = existingSubscriber;
    } else {
      let id = Id.of(sub.id);
      let name = extractName(sub);
      subscriber = Subscriber.subscribe({ id, name, email });
    }

    publisher.publish(subscriber.events);
  };
}

function extractName(sub: SubscribeCommand) {
  let name;
  if (sub.firstName) {
    let firstName = NonEmptyString.of(sub.firstName);
    name = Name.fromFirstName(firstName);
  }
  return name;
}
