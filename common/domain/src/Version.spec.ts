import { Version, VersionOutOfBoundsError } from "./Version";
import * as Faker from "faker";
describe("Version", () => {
  it("initializes to zero", () => {
    let v = Version.init();
    expect(v.value).toBe(0);
    expect(v.current).toBe(0);
  });

  it("cannot be negative", () => {
    // Faker doesn't seem to generate negative numbers correctly.
    // setting the max to 0 results in always returning zero
    let badNum = 0 - Faker.datatype.number({ min: 0 }); //?
    expect(() => Version.of(badNum)).toThrowError(VersionOutOfBoundsError);
  });

  it("is never explicitly set to zero", () => {
    expect(() => Version.of(0)).toThrowError(VersionOutOfBoundsError);
  });

  it("is a positive number", () => {
    expect(() => Version.of(1)).not.toThrow();
    let num = Faker.datatype.number({ min: Version.MIN });
    let version = Version.of(num);
    expect(version.value).toBe(num);
  });

  it("compares", () => {
    let v1 = Version.of(1);
    let v2 = Version.of(2);
    let v1too = Version.of(1);
    expect(v1.equals(v2)).toBe(false);
    expect(v2.equals(v1)).toBe(false);
    expect(v1.equals(v1too)).toBe(true);
    expect(v1too.equals(v1)).toBe(true);
  });

  it("returns the next version of itself", () => {
    let initial = Version.init();
    let next = initial.next();
    expect(next.value).toBe(1);
    expect(initial.value).toBe(0);
  });

  it("Serializes to a number", () => {
    let num = Faker.datatype.number({ min: Version.MIN });
    let version = Version.of(num);
    expect(JSON.stringify(version)).toBe(num.toString());
  });

  it("compares", () => {});
});
