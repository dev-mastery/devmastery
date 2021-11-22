import { Id, VerificationCode } from "@devmastery/common-domain";
import {
  Subscriber,
  SubscriberEvents,
} from "@devmastery/newsletter-subscription-domain";

interface ConfirmationInfo {
  id: string;
  verificationCode: string;
}

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): void;
}

interface SubscriberRepo {
  getSubscriber({ id }: { id: Subscriber["id"] }): Subscriber;
}

export function makeConfirmSubscription({
  publisher,
  repo,
}: {
  publisher: SubscriberEventPublisher;
  repo: SubscriberRepo;
}) {
  return function confirmSubscription(info: ConfirmationInfo) {
    let id = Id.of(info.id);
    let verificationCode = VerificationCode.of(info.verificationCode);

    let subscriber = repo.getSubscriber({ id });
    subscriber.confirmSubscription({ id, verificationCode });
    publisher.publish(subscriber.events);
  };
}
