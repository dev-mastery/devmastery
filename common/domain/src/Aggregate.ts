import { DomainEvent } from "./DomainEvent";
import { Id } from "./Id";
import { Version } from "./Version";

export interface AggregateProps {
  id: Id;
  version?: Version;
}

export abstract class Aggregate {
  #id: Id;
  #version: Version;
  #events: Array<DomainEvent<any>> = [];

  protected constructor(props: AggregateProps) {
    this.#id = props.id;
    this.#version = props.version ?? Version.init();
  }

  protected captureEvent(event: DomainEvent<any>) {
    this.applyEvent(event);
    this.#events.push(event);
    this.incrementVersion();
  }

  protected incrementVersion() {
    this.#version = this.#version.next();
  }

  protected abstract applyEvent(event: DomainEvent<any>): void;

  public equals(other: Aggregate): boolean {
    return this.id.equals(other.id);
  }

  public get id(): Id {
    return this.#id;
  }

  public get version(): Version {
    return this.#version;
  }

  public get events(): ReadonlyArray<DomainEvent<any>> {
    return Object.freeze(this.#events);
  }
}
