export class EmailAddress extends String {
  public static of(value: string) {
    if (!EmailAddress.isValid(value)) {
      throw new TypeError("Invalid email address.");
    }
    return new EmailAddress(value);
  }

  public static isValid(value: string): boolean {
    return EmailAddress.PATTERN.test(value);
  }

  public static get PATTERN() {
    return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  }

  private constructor(value: string) {
    super(value);
  }

  public equals(other: EmailAddress): boolean {
    return this.valueOf() === other.valueOf();
  }

  public get value() {
    return this.valueOf();
  }
}
