import { RequiredStringValidation, Validatior } from '@/aplication/validations';

export class ValidationBuilder {
  private constructor(
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validatior[] = [],
  ) {}

  static of(params: { value: string; fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName);
  }

  required(): ValidationBuilder {
    this.validators.push(
      new RequiredStringValidation(this.value, this.fieldName),
    );
    return this;
  }

  build(): Validatior[] {
    return this.validators;
  }
}
