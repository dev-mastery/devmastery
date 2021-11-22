export class NonEmptyString extends String {
  public static of(value: string): NonEmptyString {
    if (!NonEmptyString.isValid(value)) {
      throw new TypeError("Value cannot be null or empty.");
    }
    return new NonEmptyString(value);
  }

  public static isValid(value: string): boolean {
    return Boolean(value?.trim().length >= NonEmptyString.MIN_LENGTH);
  }

  public static get MIN_LENGTH(): number {
    return 1;
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: NonEmptyString): boolean {
    return this.valueOf() === other.valueOf();
  }

  public get value() {
    return this.valueOf();
  }
}
