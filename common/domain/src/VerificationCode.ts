import { ApplicationError } from "./ApplicationError";
import { NonEmptyString } from "./NonEmptyString";
import { PositiveInteger } from "./PositiveInteger";
import { RandomString } from "./RandomString";

const ALPHABET = "0123456789";
const LENGTH = 6;
const PATTERN = new RegExp(`^[${ALPHABET}]{${LENGTH}}$`);

export class VerificationCode extends String {
  public static next(): VerificationCode {
    let alphabet = NonEmptyString.of(ALPHABET);
    let length = PositiveInteger.of(LENGTH);
    let { value } = RandomString.from({ alphabet, length });
    return VerificationCode.of(value);
  }

  public static of(value: string): VerificationCode {
    if (!VerificationCode.isValid(value)) {
      throw new InvalidVerificationCodeError(value);
    }

    return new VerificationCode(value);
  }

  public static isValid(value: string): boolean {
    return VerificationCode.PATTERN.test(value);
  }

  public static get PATTERN() {
    return PATTERN;
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: VerificationCode) {
    return this.value === other.value;
  }

  public get value() {
    return this.valueOf();
  }
}

export class InvalidVerificationCodeError extends ApplicationError {
  public constructor(value: string) {
    super({
      message: NonEmptyString.of(`Malformed Verification Code: ${value}.`),
      name: NonEmptyString.of("InvalidVerificationCodeError"),
    });
  }
}
