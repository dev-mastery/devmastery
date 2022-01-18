import { ApplicationError } from "./ApplicationError";

export class NonEmptyString extends String {
  public static of(
    value: string,
    options?: { label?: string }
  ): NonEmptyString {
    if (!NonEmptyString.isValid(value)) {
      throw new EmptyStringError(options?.label);
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

export class EmptyStringError extends ApplicationError {
  constructor(label: string = "Value") {
    super({
      message: NonEmptyString.of(`${label} cannot be null or empty.`),
      name: NonEmptyString.of("EmptyStringError"),
    });
  }
}
