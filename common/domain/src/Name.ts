import { NonEmptyString } from "./NonEmptyString";

export class Name {
  #firstName: NonEmptyString;
  #lastName?: NonEmptyString;
  #middleName?: NonEmptyString;
  #title?: NonEmptyString;
  #suffix?: NonEmptyString;

  public static fromFirstName(firstName: NonEmptyString): Name {
    return new Name({ firstName });
  }

  public static of(props: {
    firstName: NonEmptyString;
    lastName?: NonEmptyString;
    middleName?: NonEmptyString;
    title?: NonEmptyString;
    suffix?: NonEmptyString;
  }) {
    return new Name(props);
  }

  private constructor(props: {
    firstName: NonEmptyString;
    lastName?: NonEmptyString;
    middleName?: NonEmptyString;
    title?: NonEmptyString;
    suffix?: NonEmptyString;
  }) {
    this.#firstName = props.firstName;
    this.#lastName = props.lastName;
    this.#middleName = props.middleName;
    this.#title = props.title;
    this.#suffix = props.suffix;
  }

  public equals(other: Name): boolean {
    if (
      other.firstName !== this.#firstName.value ||
      other.lastName !== this.#lastName?.value ||
      other.middleName !== this.#middleName?.value ||
      other.title !== this.#title?.value ||
      other.suffix !== this.#suffix?.value
    ) {
      return false;
    }

    return true;
  }

  public toString(options?: { lastNameFirst: boolean }): string {
    if (options && options.lastNameFirst) {
      return `${this.lastName}, ${this.title} ${this.firstName} ${
        this.middleName
      } ${this.suffix ? "," + this.suffix : ""}`.trim();
    }
    return `${this.title} ${this.firstName} ${this.middleName} ${
      this.lastName
    } ${this.suffix ? "," + this.suffix : ""}`.trim();
  }

  public get fullName(): string {
    return this.toString();
  }

  public get lastNameFirst(): string {
    return this.toString({ lastNameFirst: true });
  }

  public toJSON() {
    return {
      title: this.title,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      suffix: this.suffix,
      fullName: this.toString(),
      lastNameFirst: this.toString({ lastNameFirst: true }),
    };
  }

  public valueOf(): string {
    return this.toString();
  }

  public get value() {
    return this.valueOf();
  }

  public get firstName(): string {
    return this.#firstName.value;
  }

  public get lastName() {
    return this.#lastName?.value;
  }

  public get middleName() {
    return this.#middleName?.value;
  }

  public get title() {
    return this.#title?.value;
  }

  public get suffix() {
    return this.#suffix?.value;
  }
}
