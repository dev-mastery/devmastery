import { Id } from "./Id";
import { NonEmptyString } from "./NonEmptyString";

export interface DomainEventProps<TData> {
  id?: Id;
  name?: NonEmptyString;
  occurredAt?: Date;
  data: TData;
}

export abstract class DomainEvent<TData> {
  #id: Id;
  #name: NonEmptyString;
  #occurredAt: Date;
  #data: TData;

  protected constructor(props: DomainEventProps<TData>) {
    this.#name = props.name ?? NonEmptyString.of(this.constructor.name);
    this.#data = props.data;
    this.#occurredAt = props.occurredAt ?? new Date();
    this.#id = props.id ?? Id.next();
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      data: this.data,
      occurredAt: Date.parse(this.occurredAt.toUTCString()),
    };
  }

  public get id() {
    return this.#id;
  }

  public get name() {
    return this.#name;
  }

  public get occurredAt() {
    return this.#occurredAt;
  }

  public get data() {
    return this.#data;
  }
}
