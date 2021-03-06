import faker from "faker";

import {
  EmptyStringError,
  MalformedError,
  MaxLengthError,
  MinLengthError,
  NonEmptyString,
  NullValueError,
  UnnamedStringError,
} from "./NonEmptyString";

describe("NonEmptyString", () => {
  it("prevents empty strings", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    expect(() => TestNonEmpty.of("")).toThrow(EmptyStringError);
  });

  it("prevents null strings", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    expect(() => TestNonEmpty.of((null as never) as string)).toThrow(
      NullValueError
    );
  });

  it("checks non-empty string validity", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    expect(TestNonEmpty.isValid("")).toBe(false);
    expect(TestNonEmpty.isValid("Not empty")).toBe(true);
    expect(TestNonEmpty.isValid((null as never) as string)).toBe(false);
    expect(TestNonEmpty.isValid((1 as unknown) as string)).toBe(false);
  });

  it("exposes string length", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    const length = Math.ceil(Math.random() * 10);
    const string = faker.lorem.word(length);
    const nonEmpty = TestNonEmpty.of(string);
    expect(nonEmpty.length).toBe(length);
  });

  it("compares non-empty strings", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    const a = TestNonEmpty.of("a");
    const a2 = TestNonEmpty.of("a");
    const b = TestNonEmpty.of("b");
    expect(a.equals(a2)).toBe(true);
    expect(b.equals(a)).toBe(false);
  });

  it("acts like a String but isn't a string", () => {
    class TestNonEmpty extends NonEmptyString.named("TestNonEmpty").BaseClass {}
    const aString = faker.lorem.word();
    const nonEmpty = TestNonEmpty.of(aString);

    expect(nonEmpty + aString).toBe(aString + aString);
    expect(nonEmpty.includes(aString)).toBe(aString.includes(aString));
    expect(nonEmpty.valueOf()).toBe(aString);
    expect(nonEmpty.length).toBe(aString.length);
    expect(JSON.stringify(nonEmpty)).toBe(JSON.stringify(aString));
    expect(nonEmpty.toString()).toBe(aString);
    expect(nonEmpty.charAt(0)).toBe(aString.charAt(0));
    expect(nonEmpty).not.toBe(String(aString));
  });

  it("Exposes a static constructor", () => {
    const aString = "aString";
    const nonEmpty = NonEmptyString.of("NonEmpty", aString);
    expect(nonEmpty.toString()).toBe(aString);
  });

  it("Supports min and max lengths", () => {
    const min = 5;
    const max = 8;
    class LengthRestricted extends NonEmptyString.named("LengthRestricted")
      .minLength(min)
      .maxLength(max).BaseClass {}

    expect(LengthRestricted.of(faker.lorem.word(min)).minLength).toBe(min);
    expect(() => LengthRestricted.of(faker.lorem.word(min - 1))).toThrow(
      MinLengthError
    );

    expect(LengthRestricted.of(faker.lorem.word(min)).maxLength).toBe(max);
    expect(() => LengthRestricted.of(faker.lorem.word(max + 1))).toThrow(
      MaxLengthError
    );
  });

  it("Supports format restrictions", () => {
    const format = /^[0-9]+$/;
    class NumericString extends NonEmptyString.named("NumericString").format(
      format
    ).BaseClass {}

    expect(NumericString.of("10").format).toBe(format);
    expect(() => NumericString.of("abc")).toThrow(MalformedError);
    expect(() => NumericString.of("77 a")).toThrow(MalformedError);
    expect(() => NumericString.of(" 15 ")).not.toThrow(MalformedError);
    expect(() => NumericString.of("5")).not.toThrow();
  });

  it("Must be named", () => {
    expect(() => NonEmptyString.of("   ", "unnamed")).toThrow(
      UnnamedStringError
    );
    expect(() => NonEmptyString.named("")).toThrow(UnnamedStringError);
    expect(() => NonEmptyString.named("  ")).toThrow(UnnamedStringError);
    expect(() => NonEmptyString.named((null as unknown) as string)).toThrow(
      UnnamedStringError
    );
  });

  it("Exposes validation", () => {
    const format = /^[A-Z]+$/;
    const minLength = 2;
    const maxLength = 3;
    class MyString extends NonEmptyString.named("MyString")
      .format(format)
      .minLength(minLength)
      .maxLength(maxLength).BaseClass {}

    const valid = ["AA", "BBB", "CD", "EFG"];
    valid.forEach((s) => {
      expect(MyString.validate(s).error).toBeUndefined();
      expect(MyString.validate(s).isValid()).toBe(true);
      expect(MyString.validate(s).isNotValid()).toBe(false);
      expect(MyString.isValid(s)).toBe(true);
    });

    const notValid = ["aa", "A", "DDDD", (null as unknown) as string];
    notValid.forEach((s) => {
      expect(MyString.validate(s).error).toBeDefined();
      expect(MyString.validate(s).isValid()).toBe(false);
      expect(MyString.validate(s).isNotValid()).toBe(true);
      expect(MyString.isValid(s)).toBe(false);
      expect(() => MyString.validate(s).throwIfNotValid()).toThrow();
    });

    expect.assertions(valid.length * 4 + notValid.length * 5);
  });
});
