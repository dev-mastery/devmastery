import { DomainEvent } from "./DomainEvent";
import { Id } from "./Id";
import { PositiveInteger } from "./PositiveInteger";

export interface AggregateProps {
  id: Id;
  version?: PositiveInteger;
}

export abstract class Aggregate {
  #id: Id;
  #version: PositiveInteger;
  #events: Array<DomainEvent<any>> = [];

  protected constructor(props: AggregateProps) {
    this.#id = props.id;
    this.#version = props.version ?? PositiveInteger.of(1);
  }

  protected captureEvent(event: DomainEvent<any>) {
    this.applyEvent(event);
    this.#events.push(event);
  }

  protected incrementVersion() {
    this.#version = this.#version.plus(PositiveInteger.of(1));
  }

  protected abstract applyEvent(event: DomainEvent<any>): void;

  public get id(): Id {
    return this.#id;
  }

  public get version(): PositiveInteger {
    return this.#version;
  }

  public get events(): ReadonlyArray<DomainEvent<any>> {
    return Object.freeze(this.#events);
  }
}
