import { Aggregate } from "./Aggregate";
import { Id } from "./Id";

export interface DomainEventProps<
  Tdata extends Record<string, any> = Record<string, any>
> {
  aggregateId: Aggregate["id"];
  aggregateVersion: Aggregate["version"];
  data: Tdata;
  eventId?: Id;
  occurredAt?: Date;
}

export abstract class DomainEvent<
  Tdata extends Record<string, any> = Record<string, any>
> {
  #aggregateId: Aggregate["id"];
  #aggregateVersion: Aggregate["version"];
  #data: Tdata;
  #eventId: Id;
  #occurredAt: Date;

  protected constructor(props: DomainEventProps<Tdata>) {
    this.#aggregateId = props.aggregateId;
    this.#aggregateVersion = props.aggregateVersion;
    this.#data = props.data;
    this.#eventId = props.eventId ?? Id.next();
    this.#occurredAt = props.occurredAt ?? new Date();
  }

  public toJSON() {
    return {
      eventId: this.eventId.value,
      aggregateId: this.aggregateId.value,
      data: this.data.toJSON ? this.data.toJSON() : this.data,
      aggregateVersion: this.aggregateVersion.value,
      occurredAt: this.occurredAt.toISOString(),
    };
  }

  public equals(other: DomainEvent<Tdata>): boolean {
    return this.eventId === other.eventId;
  }

  get aggregateVersion() {
    return this.#aggregateVersion;
  }

  get data(): Tdata {
    return this.#data;
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
