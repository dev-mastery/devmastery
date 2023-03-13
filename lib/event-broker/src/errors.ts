export class EnvironmentVariableError extends TypeError {
  constructor(variableName: string) {
    super(
      `Please set the "${variableName}" environment variable to a valid value.`
    );
  }
}
