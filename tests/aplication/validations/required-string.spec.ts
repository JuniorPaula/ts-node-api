import { RequiredStringValidation } from '@/aplication/validations/required-string';
import { RequiredField } from '@/aplication/errors';

describe('RequiredStringValidation', () => {
  test('Should return RequiredField if value is empty', async () => {
    const sut = new RequiredStringValidation('', 'any_field');
    const error = sut.validate();

    expect(error).toEqual(new RequiredField('any_field'));
  });

  test('Should return RequiredField if value is null', async () => {
    const sut = new RequiredStringValidation(null as any, 'any_field');
    const error = sut.validate();

    expect(error).toEqual(new RequiredField('any_field'));
  });

  test('Should return RequiredField if value is undefined', async () => {
    const sut = new RequiredStringValidation(undefined as any, 'any_field');
    const error = sut.validate();

    expect(error).toEqual(new RequiredField('any_field'));
  });

  test('Should return undefined if value is not empty', async () => {
    const sut = new RequiredStringValidation('any_value', 'any_field');
    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
