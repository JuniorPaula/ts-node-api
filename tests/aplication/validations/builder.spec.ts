import {
  RequiredStringValidation,
  ValidationBuilder,
} from '@/aplication/validations';

describe('ValidationBuilder', () => {
  test('Should create a RequiredStringValidator', () => {
    const validator = ValidationBuilder.of({
      value: 'any_value',
      fieldName: 'any_name',
    })
      .required()
      .build();

    expect(validator).toEqual([
      new RequiredStringValidation('any_value', 'any_name'),
    ]);
  });
});
