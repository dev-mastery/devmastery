import { NonEmptyString } from "./NonEmptyString";

export interface ApplicationErrorProps {
  message: NonEmptyString;
  name: NonEmptyString;
}

export class ApplicationError extends Error {
  constructor({ message, name }: ApplicationErrorProps) {
    super(message.toString());
    this.name = name.toString();
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      name: this.name.toString(),
      message: this.message.toString(),
    };
  }
}
