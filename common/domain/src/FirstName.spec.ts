import {
  FirstName,
  FirstNameEmptyError,
  FirstNameNullOrUndefinedError,
  FirstNameTooShortError,
} from "./FirstName";
import * as Faker from "faker";

describe("FirstName", () => {
  it("should create an instance", () => {
    let name = Faker.name.firstName();
    expect(FirstName.of(name)).toBeInstanceOf(FirstName);
  });
  it("cannot be empty", () => {
    expect(() => FirstName.of("")).toThrow(FirstNameEmptyError);
  });
  it("must have at least 2 characters", () => {
    let shortName = Faker.lorem.word(FirstName.MIN_LENGTH - 1);
    expect(() => FirstName.of(shortName)).toThrow(FirstNameTooShortError);
  });
  it("cannot be null or undefined", () => {
    expect(() => FirstName.of(null)).toThrow(FirstNameNullOrUndefinedError);
    expect(() => FirstName.of(undefined)).toThrow(
      FirstNameNullOrUndefinedError
    );
  });
  it("has a value", () => {
    let name = Faker.name.firstName();
    expect(FirstName.of(name).value).toBe(name);
  });
  it("serializes to JSON", () => {
    let name = Faker.name.firstName();
    expect(FirstName.of(name).toJSON()).toBe(name);
    expect(JSON.stringify(FirstName.of(name))).toBe(`"${name}"`);
  });
});
