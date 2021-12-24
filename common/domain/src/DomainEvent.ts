import { Aggregate } from "./Aggregate";
import { Id } from "./Id";

export interface DomainEventProps<
  TPayload extends Record<string, any> = Record<string, any>
> {
  aggregateId: Aggregate["id"];
  aggregateVersion: Aggregate["version"];
  payload: TPayload;
  eventId?: Id;
  occurredAt?: Date;
}

export abstract class DomainEvent<
  TPayload extends Record<string, any> = Record<string, any>
> {
  #aggregateId: Aggregate["id"];
  #aggregateVersion: Aggregate["version"];
  #payload: TPayload;
  #eventId: Id;
  #occurredAt: Date;

  protected constructor(props: DomainEventProps<TPayload>) {
    this.#aggregateId = props.aggregateId;
    this.#aggregateVersion = props.aggregateVersion;
    this.#payload = props.payload;
    this.#eventId = props.eventId ?? Id.next();
    this.#occurredAt = props.occurredAt ?? new Date();
  }

  public toJSON() {
    return {
      eventId: this.eventId.value,
      aggregateId: this.aggregateId.value,
      payload: this.payload.toJSON ? this.payload.toJSON() : this.payload,
      aggregateVersion: this.aggregateVersion.value,
      occurredAt: this.occurredAt.toISOString(),
    };
  }

  public equals(other: DomainEvent<TPayload>): boolean {
    return this.eventId === other.eventId;
  }

  get aggregateVersion() {
    return this.#aggregateVersion;
  }

  get payload(): TPayload {
    return this.#payload;
  }

  get occurredAt(): Date {
    return this.#occurredAt;
  }

  get aggregateId(): Aggregate["id"] {
    return this.#aggregateId;
  }

  get eventId(): Id {
    return this.#eventId;
  }
}
