class ValidationError extends Error {
  field: string;
  message: string;

  constructor({ field, message }: { field: string; message: string }) {
    super(`Validation error on field "${field}": ${message}`);
    this.field = field;
    this.message = message;
  }
}

export { ValidationError };
