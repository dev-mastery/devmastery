import * as Faker from "faker";
import { EmailAddress } from "./EmailAddress";
describe("EmailAddress", () => {
  it("only accepts valid email addresses", () => {
    let valid = [
      Faker.internet.email(),
      Faker.internet.email(),
      Faker.internet.email(),
    ];
    let invalid = ["aaa", "", null, undefined, 1, "a@b", "a.v@x"];

    valid.forEach((email) => {
      expect(() => EmailAddress.of(email)).not.toThrowError();
    });

    invalid.forEach((email) => {
      expect(() => EmailAddress.of(email as any as string)).toThrowError();
    });
  });

  it("is treated as a string", () => {
    let email = Faker.internet.email();
    let expected = `Your email address is: ${email}`;
    let actual = `Your email address is: ${EmailAddress.of(email)}`;
    expect(actual).toBe(expected);
  });
});
