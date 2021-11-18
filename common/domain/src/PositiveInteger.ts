export class PositiveInteger extends Number {
  public static of(value: number) {
    if (typeof value !== "number") {
      throw new TypeError("Value must be a number.");
    }
    if (value < 1) {
      throw new TypeError("Value must be greater than 0.");
    }
    return new PositiveInteger(value);
  }

  private constructor(value: number) {
    super(value);
  }

  public get value(): number {
    return this.valueOf();
  }

  public plus(amount: PositiveInteger = PositiveInteger.of(1)) {
    return PositiveInteger.of(this.value + amount.value);
  }

  public minus(amount: PositiveInteger = PositiveInteger.of(1)) {
    if (this.valueOf() <= 1) {
      throw new RangeError(
        `Decrementing ${this.toString()} by ${amount.toString()} is not supported. PositivieInteger values must remain greater than 0.`
      );
    }
    return PositiveInteger.of(this.value - amount.value);
  }
}
