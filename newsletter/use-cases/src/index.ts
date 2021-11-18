import { makeSubscribe } from "./subscribe";
import { makeConfirmSubscription } from "./confirm-subscription";
import { SubscriberEvents, Subscriber } from "@devmastery/newsletter-domain";
import { EmailAddress } from "@devmastery/common-domain";

let publisherStub = {
  publish(events: Readonly<SubscriberEvents>): void {},
};

// let repoStub = {
//   getSubscriber({ id }: { id: Subscriber["id"] }) {

//   }
//   findByEmail(email: EmailAddress): Subscriber {}
// }
