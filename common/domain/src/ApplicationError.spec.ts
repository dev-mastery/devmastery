import { ApplicationError } from "./ApplicationError";
import * as Faker from "faker";
class ApplicationErrorMock extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

describe("Application Error", () => {
  it("is named after its constructor", () => {
    const error = new ApplicationErrorMock("");
    expect(error.name).toBe("ApplicationErrorMock");
  });
  it("has a message", () => {
    const message = Faker.lorem.sentence();
    const error = new ApplicationErrorMock(message);
    expect(error.message).toBe(message);
  });
  it("serializes to JSON", () => {
    const message = Faker.lorem.sentence();
    const error = new ApplicationErrorMock(message);
    let errJson = {
      name: "ApplicationErrorMock",
      message: message,
    };
    expect(error.toJSON()).toEqual(errJson);
    expect(JSON.stringify(error)).toBe(JSON.stringify(errJson));
  });
});
