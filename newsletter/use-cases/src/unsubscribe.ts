import { Id } from "@devmastery/common-domain";
import {
  Subscriber,
  SubscriberEvents,
  UnsubscribeReason,
} from "@devmastery/newsletter-domain";

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): void;
}

interface SubscriberRepo {
  getSubscriber({ id }: { id: Subscriber["id"] }): Subscriber;
}

interface UnsubscribeInfo {
  id: string;
  reason?: string;
}

export function makeUnsubscribe({
  publisher,
  repo,
}: {
  publisher: SubscriberEventPublisher;
  repo: SubscriberRepo;
}) {
  return function unsubscribe(info: UnsubscribeInfo) {
    let subscriber = repo.getSubscriber({ id: Id.of(info.id) });
    let reason;
    if (info.reason) {
      reason = UnsubscribeReason.parse(info.reason);
    }
    subscriber.unsubscribe({ reason });
    publisher.publish(subscriber.events);
  };
}
