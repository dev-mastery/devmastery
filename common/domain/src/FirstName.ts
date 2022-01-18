import { ApplicationError } from "./ApplicationError";
import { NonEmptyString } from "./NonEmptyString";
import { Validated } from "./ValidationResult";

export class FirstName extends String {
  public static of(value: string): FirstName {
    let validatedFirstName = FirstName.Valididate(value);
    if (validatedFirstName.error) throw validatedFirstName.error;
    return validatedFirstName.value;
  }

  public static get MIN_LENGTH(): number {
    return 2;
  }

  public static Valididate(value: string): Validated<FirstName> {
    if (value == null) {
      return { error: new FirstNameNullOrUndefinedError() };
    }

    let trimmed = value.trim();
    if (!trimmed.length) {
      return { error: new FirstNameEmptyError() };
    }

    if (trimmed.length < FirstName.MIN_LENGTH) {
      return { error: new FirstNameTooShortError() };
    }

    return { value: new FirstName(trimmed) };
  }

  private constructor(value: string) {
    super(value);
  }

  public get value(): string {
    return this.valueOf();
  }

  public toJSON() {
    return this.value;
  }
}

export class FirstNameTooShortError extends ApplicationError {
  public constructor() {
    super({
      message: NonEmptyString.of(
        `First name must be at least ${FirstName.MIN_LENGTH} characters long.`
      ),
      name: NonEmptyString.of("FirstNameTooShortError"),
    });
  }
}

export class FirstNameNullOrUndefinedError extends ApplicationError {
  public constructor() {
    super({
      message: NonEmptyString.of(`First name cannot be null or undefined.`),
      name: NonEmptyString.of("FirstNameNullOrUndefinedError"),
    });
  }
}

export class FirstNameEmptyError extends ApplicationError {
  public constructor() {
    super({
      message: NonEmptyString.of(`First name cannot be blank.`),
      name: NonEmptyString.of("FirstNameEmptyError"),
    });
  }
}
