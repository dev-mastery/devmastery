import {
  InvalidVerificationCodeError,
  VerificationCode,
} from "./VerificationCode";

describe("Verification Code", () => {
  it("gets the next valid verification code", () => {
    let code = VerificationCode.next();
    expect(code.length).toBe(6);
    expect(code.match(/^\d{6}$/)).toBeTruthy();
  });
  it("returns its value", () => {
    let code = VerificationCode.next();
    expect(code.value).toBe(code.toString());
  });
  it("wraps an existing verification code", () => {
    let code = VerificationCode.of("123456");
    expect(code.value).toBe("123456");
  });
  it("compares", () => {
    let code1 = VerificationCode.of("123456");
    let code2 = VerificationCode.of("123456");
    expect(code1.equals(code2)).toBe(true);
    expect(code1.equals(VerificationCode.of("654321"))).toBe(false);
  });
  it("validates", () => {
    let badCodes = ["123", "", "1234567", "abc123"];
    badCodes.forEach((code) => {
      expect(VerificationCode.isValid(code)).toBe(false);
      expect(() => {
        VerificationCode.of(code);
      }).toThrow(InvalidVerificationCodeError);
    });
    expect.assertions(badCodes.length * 2);
  });
  it("serializes to JSON", () => {
    let code = VerificationCode.of("123456");
    expect(JSON.stringify(code)).toEqual('"123456"');
  });
  it("handles numbers", () => {
    let code = VerificationCode.of(123456 as any as string);
    expect(code.value).toBe("123456");
  });
});
