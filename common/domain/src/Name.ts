import { FirstName } from "./FirstName";

interface NameProps {
  firstName: FirstName;
}

export class Name extends String {
  #firstName: FirstName;

  public static firstNameOnly(value: string): Name {
    let firstName = FirstName.of(value);
    return new Name({ firstName });
  }

  private constructor({ firstName }: NameProps) {
    super(`${firstName}`);
    this.#firstName = firstName;
  }

  public get firstName(): string {
    return this.#firstName.value;
  }

  public get value(): string {
    return this.valueOf();
  }
}
