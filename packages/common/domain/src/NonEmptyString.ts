export class NonEmptyString extends String {
  public static of(value: string): NonEmptyString {
    if (!NonEmptyString.isValid(value)) {
      throw new TypeError("Value cannot be null or empty.");
    }
    return new NonEmptyString(value);
  }

  public static isValid(value: string): boolean {
    return Boolean(value?.length);
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: NonEmptyString): boolean {
    return this.valueOf() === other.valueOf();
  }
}
