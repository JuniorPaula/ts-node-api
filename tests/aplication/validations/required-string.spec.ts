import { RequiredStringValidation } from '@/aplication/validations/required-string';
import { RequiredField } from '@/aplication/errors';

describe('RequiredStringValidation', () => {
  test('Should return RequiredField if value is empty', async () => {
    const sut = new RequiredStringValidation('', 'any_field');
    const error = sut.validate();

    expect(error).toEqual(new RequiredField('any_field'));
  });
});
