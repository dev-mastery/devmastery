import { customAlphabet, urlAlphabet } from "nanoid";

export class Id extends String {
  public static next(): Id {
    const makeId = customAlphabet(Id.ALPHABET, Id.SIZE);
    return new Id(makeId());
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
    return /^[a-zA-Z0-9_-]{21}$/;
  }

  public static get SIZE(): number {
    return 21;
  }

  public static get ALPHABET(): string {
    return urlAlphabet;
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
