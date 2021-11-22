import { NonEmptyString } from "./NonEmptyString";
import { PositiveInteger } from "./PositiveInteger";
import { RandomString } from "./RandomString";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const LENGTH = 22;

export class Id extends String {
  public static next(): Id {
    let alphabet = NonEmptyString.of(ALPHABET);
    let length = PositiveInteger.of(LENGTH);
    let { value } = RandomString.from({ alphabet, length });
    return Id.of(value);
  }

  public static of(value: string): Id {
    if (!Id.isValid(value)) {
      throw new TypeError("Malformed id.");
    }

    return new Id(value);
  }

  public static isValid(value: string): boolean {
    return Id.PATTERN.test(value);
  }

  public static get PATTERN() {
    return /^[a-zA-Z0-9]{22}$/;
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: Id) {
    return this.valueOf() === other.valueOf();
  }

  public toJSON(): string {
    return this.toString();
  }

  public get value() {
    return this.valueOf();
  }
}
