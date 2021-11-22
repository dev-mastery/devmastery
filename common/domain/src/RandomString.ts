import { NonEmptyString } from "./NonEmptyString";
import { PositiveInteger } from "./PositiveInteger";
import { customAlphabet } from "nanoid";

const DEFAULT_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export class RandomString {
  #value;

  public static from(options: {
    length: PositiveInteger;
    alphabet?: NonEmptyString;
  }) {
    return new RandomString({
      length: options.length.value,
      alphabet: options.alphabet?.value,
    });
  }

  private constructor(options: { length: number; alphabet?: string }) {
    let alphabet = options.alphabet ?? DEFAULT_ALPHABET;
    let size = options.length;
    const makeRandomString = customAlphabet(alphabet, size);
    this.#value = makeRandomString();
  }

  public get value() {
    return this.valueOf();
  }

  public valueOf() {
    return this.#value;
  }

  public toJSON() {
    return this.value;
  }
}
