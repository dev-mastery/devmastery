import { ApplicationError } from "./ApplicationError";

export class Version extends Number {
  public static init() {
    return new Version(0);
  }

  public static of(value: number): Version {
    if (value < Version.MIN) {
      throw new VersionOutOfBoundsError();
    }
    return new Version(value);
  }

  constructor(value: number) {
    super(value);
  }

  public next(): Version {
    return new Version(this.value + 1);
  }

  public equals(other: Version): boolean {
    return this.value === other.value;
  }

  public get value(): number {
    return this.valueOf();
  }

  public get current(): number {
    return this.value;
  }

  public static get MIN() {
    return 1;
  }
}

export class VersionOutOfBoundsError extends ApplicationError {
  constructor() {
    super("Version must be greater than 0.");
    this.name = "VersionOutOfBoundsError";
  }
}
