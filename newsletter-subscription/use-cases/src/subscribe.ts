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

interface SubscriberRepo {
  findByEmail(email: EmailAddress): Promise<Subscriber>;
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
  repo: SubscriberRepo;
}) {
  return async function subscribe(command: SubscribeCommand) {
    let subscriber;
    let email = EmailAddress.of(command.email);
    let existingSubscriber = await repo.findByEmail(email);

    if (existingSubscriber) {
      subscriber = existingSubscriber;
    } else {
      let id = Id.of(command.id);
      let name = extractName(command);
      subscriber = Subscriber.subscribe({ id, name, email });
    }

    publisher.publish(subscriber.events);
  };
}

function extractName(command: SubscribeCommand) {
  let name;
  if (command.firstName) {
    let firstName = NonEmptyString.of(command.firstName);
    name = Name.fromFirstName(firstName);
  }
  return name;
}
