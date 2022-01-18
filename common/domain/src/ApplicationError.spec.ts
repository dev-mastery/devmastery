import { ApplicationError } from "./ApplicationError";
import * as Faker from "faker";
import { NonEmptyString } from "./NonEmptyString";

describe("Application Error", () => {
  it("has a name", () => {
    const errorName = NonEmptyString.of(Faker.lorem.word());
    const error = new ApplicationError({
      name: errorName,
      message: NonEmptyString.of("Appl"),
    });
    expect(error.name).toBe(errorName.toString());
  });
  it("has a message", () => {
    const errorName = NonEmptyString.of(Faker.lorem.word());
    const message = NonEmptyString.of(Faker.lorem.sentence());
    const error = new ApplicationError({ name: errorName, message });
    expect(error.message).toBe(message.toString());
  });
  it("serializes to JSON", () => {
    const message = NonEmptyString.of(Faker.lorem.sentence());
    const errorName = NonEmptyString.of(Faker.lorem.word());
    const error = new ApplicationError({ message, name: errorName });
    let errJson = {
      name: errorName.toString(),
      message: message.toString(),
    };
    expect(error.toJSON()).toEqual(errJson);
    expect(JSON.stringify(error)).toBe(JSON.stringify(errJson));
  });
});
