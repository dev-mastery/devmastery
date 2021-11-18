export type UnsubscribeReasonId =
  typeof UnsubscribeReason.VALID_REASONS[number];

export class UnsubscribeReason {
  #value: UnsubscribeReasonId;
  static parse(value: string): UnsubscribeReason {
    if (!UnsubscribeReason.isValidReason(value)) {
      throw new RangeError(
        "Reason must be one of: " + UnsubscribeReason.VALID_REASONS.join()
      );
    }
    return new UnsubscribeReason(value);
  }

  static get NO_REASON_GIVEN() {
    return new UnsubscribeReason("NO_REASON_GIVEN");
  }

  static get NOT_RELEVANT() {
    return new UnsubscribeReason("NOT_RELEVANT");
  }

  static isValidReason(value: string): value is UnsubscribeReasonId {
    return UnsubscribeReason.VALID_REASONS.includes(
      value as UnsubscribeReasonId
    );
  }

  static get VALID_REASONS() {
    return ["NOT_RELEVANT", "NO_REASON_GIVEN"] as const;
  }

  constructor(id: UnsubscribeReasonId) {
    this.#value = id;
  }

  public get value(): string {
    return this.#value;
  }
}
