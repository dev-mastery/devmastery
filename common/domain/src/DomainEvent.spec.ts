import { DomainEvent, DomainEventProps } from "./DomainEvent";
import { Id } from "./Id";
import { Version } from "./Version";

class DomainEventMock extends DomainEvent {
  constructor(props: DomainEventProps) {
    super(props);
  }
}

describe("DomainEvent", () => {
  it("can be created", () => {
    const props: DomainEventProps = {
      aggregateId: Id.next(),
      aggregateVersion: Version.init(),
      payload: {},
      eventId: Id.next(),
      occurredAt: new Date(),
    };
    const event = new DomainEventMock(props);
    expect(event.aggregateId).toBe(props.aggregateId);
    expect(event.aggregateVersion).toBe(props.aggregateVersion);
    expect(event.payload).toBe(props.payload);
    expect(event.eventId).toBe(props.eventId);
    expect(event.occurredAt).toBe(props.occurredAt);
  });
  it("serializes to JSON", () => {
    const props: DomainEventProps = {
      aggregateId: Id.next(),
      aggregateVersion: Version.init(),
      payload: {
        foo: "bar",
        num: 123,
      },
      eventId: Id.next(),
      occurredAt: new Date(),
    };
    const event = new DomainEventMock(props);
    expect(event.toJSON()).toEqual({
      aggregateId: props.aggregateId.toString(),
      aggregateVersion: props.aggregateVersion.valueOf(),
      payload: props.payload,
      eventId: props.eventId.toString(),
      occurredAt: props.occurredAt.toISOString(),
    });
  });
  it("assigns an event id", () => {
    const event = new DomainEventMock({
      aggregateId: Id.next(),
      aggregateVersion: Version.of(1),
      payload: {},
    });
    expect(event.eventId).toBeDefined();
    expect(event.eventId instanceof Id).toBe(true);
  });
  it("assigns an event occuredAt date", () => {
    const event = new DomainEventMock({
      aggregateId: Id.next(),
      aggregateVersion: Version.of(1),
      payload: {},
    });
    expect(event.occurredAt).toBeDefined();
    expect(event.occurredAt instanceof Date).toBe(true);
  });
  it("compares", () => {
    let id = Id.next();
    const event1 = new DomainEventMock({
      eventId: id,
      aggregateId: Id.next(),
      aggregateVersion: Version.of(1),
      payload: {},
    });
    const event2 = new DomainEventMock({
      eventId: id,
      aggregateId: Id.next(),
      aggregateVersion: Version.of(1),
      payload: {},
    });
    expect(event1.equals(event2)).toBe(true);
  });
});
