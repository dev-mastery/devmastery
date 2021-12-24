import { Aggregate } from "./Aggregate";
import { DomainEvent } from "./DomainEvent";
import { Id } from "./Id";

class TestAggregate extends Aggregate {
  protected applyEvent(event: DomainEvent<any>): void {
    // noop
  }
  public static of(id: Id) {
    return new TestAggregate({ id });
  }

  public doSomething(event: DomainEvent<any>): void {
    this.captureEvent(event);
    this.incrementVersion();
  }
}

class TestEvent extends DomainEvent<any> {
  constructor(props: any) {
    super(props);
  }
}

describe("Aggregate", () => {
  it("increments version", () => {
    let id = Id.next();
    let aggregate = TestAggregate.of(id);
    let event = new TestEvent({ id });
    expect(aggregate.version.value).toBe(0);
    aggregate.doSomething(event);
    expect(aggregate.version.value).toBe(1);
  });
  it("captures an event", () => {
    let id = Id.next();
    let aggregate = TestAggregate.of(id);
    let event = new TestEvent({ id });
    aggregate.doSomething(event);
    expect(aggregate.events.length).toBe(1);
    expect(aggregate.events[0]).toBe(event);
  });
  it("compares", () => {
    let id = Id.next();
    let aggregate = TestAggregate.of(id);
    let other = TestAggregate.of(id);
    let different = TestAggregate.of(Id.next());
    expect(aggregate.equals(other)).toBe(true);
    expect(aggregate.equals(different)).toBe(false);
  });
});
