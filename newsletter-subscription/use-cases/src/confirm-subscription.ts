import { Id, VerificationCode } from "@devmastery/common-domain";
import {
  Subscriber,
  SubscriberEvents,
} from "@devmastery/newsletter-subscription-domain";

interface ConfirmCommand {
  id: string;
  verificationCode: string;
}

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): void;
}

interface SubscriberEventsRepo {
  getSubscriber(id: Subscriber["id"]): Promise<Subscriber>;
}

export function makeConfirmSubscription({
  publisher,
  repo,
}: {
  publisher: SubscriberEventPublisher;
  repo: SubscriberEventsRepo;
}) {
  return async function confirmSubscription(confirm: ConfirmCommand) {
    let id = Id.of(confirm.id);
    let verificationCode = VerificationCode.of(confirm.verificationCode);

    let subscriber = await repo.getSubscriber(id);
    subscriber.confirmSubscription({ id, verificationCode });
    publisher.publish(subscriber.events);
  };
}
