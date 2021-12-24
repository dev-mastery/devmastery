import { Name } from "./Name";
import * as Faker from "faker";

describe("Name", () => {
  it("should create an instance", () => {
    let firstName = Faker.name.firstName();
    expect(Name.firstNameOnly(firstName)).toBeInstanceOf(Name);
  });
  it("returns the first name", () => {
    let firstName = Faker.name.firstName();
    let name = Name.firstNameOnly(firstName);
    expect(name.firstName).toBe(firstName);
  });
  it("returns the entire name", () => {
    let firstName = Faker.name.firstName();
    let name = Name.firstNameOnly(firstName);
    expect(name.value).toBe(firstName);
  });
});
