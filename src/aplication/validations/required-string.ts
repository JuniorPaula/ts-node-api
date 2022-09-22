import { RequiredField } from '@/aplication/errors';

export class RequiredStringValidation {
  constructor(
    private readonly value: string,
    private readonly fieldName: string,
  ) {}
  validate(): Error | undefined {
    return new RequiredField('any_field');
  }
}
