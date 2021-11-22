import { customAlphabet } from "nanoid";

export class VerificationCode extends String {
  public static next() {
    const generateCode = customAlphabet(VerificationCode.ALPHABET, 6);
    const code = generateCode();
    return new VerificationCode(code);
  }

  public static of(value: string | number) {
    const code = value.toString().trim();
    VerificationCode.validate(code);
    return new VerificationCode(code);
  }

  private static validate(value: unknown) {
    if (typeof value !== "string" || !VerificationCode.isValid(value)) {
      throw new TypeError(
        "Value must be a string containing exactly six digits."
      );
    }
  }

  public static isValid(value: string) {
    return VerificationCode.PATTERN.test(value);
  }

  public static get ALPHABET() {
    return "0123456789";
  }

  public static get PATTERN() {
    return /^\d{6}$/;
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: VerificationCode) {
    return this.valueOf() === other.valueOf();
  }

  public get value() {
    return this.valueOf();
  }
}
