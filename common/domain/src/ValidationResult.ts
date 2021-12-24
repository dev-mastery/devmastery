export type Validated<T> =
  | {
      error: Error;
      value?: never;
    }
  | {
      error?: never;
      value: T;
    };
