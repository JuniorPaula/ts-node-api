export class BadRequest extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`);
  }
}
