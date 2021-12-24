import { Id } from "@devmastery/common-domain";
import {
  Subscriber,
  SubscriberEvents,
  UnsubscribeReason,
} from "@devmastery/newsletter-subscription-domain";

interface SubscriberEventPublisher {
  publish(events: Readonly<SubscriberEvents>): void;
}

interface SubscriberRepo {
  getSubscriber(id: Subscriber["id"]): Promise<Subscriber>;
}

interface UnsubscribeCommand {
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
  return async function unsubscribe(unsub: UnsubscribeCommand) {
    let id = Id.of(unsub.id);
    let subscriber = await repo.getSubscriber(id);
    let reason;
    if (unsub.reason) {
      reason = UnsubscribeReason.parse(unsub.reason);
    }
    subscriber.unsubscribe({ reason });
    publisher.publish(subscriber.events);
  };
}
