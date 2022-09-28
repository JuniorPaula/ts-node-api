import { mock, MockProxy } from 'jest-mock-extended';

interface Validatior {
  validate(): Error | undefined;
}

class ValidationComposite implements Validatior {
  constructor(private readonly validators: Validatior[]) {}

  validate(): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate();
      if (error !== undefined) {
        return error;
      }
    }
  }
}

describe('ValidationComposite', () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validatior>;
  let validator2: MockProxy<Validatior>;
  let validators: Validatior[];

  beforeAll(() => {
    validator1 = mock<Validatior>();
    validator1.validate.mockReturnValue(undefined);

    validator2 = mock<Validatior>();
    validator2.validate.mockReturnValue(undefined);

    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  test('Should return undefined if all validators returns undefined', () => {
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  test('Should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('Error_1'));
    validator2.validate.mockReturnValueOnce(new Error('Error_2'));

    const error = sut.validate();

    expect(error).toEqual(new Error('Error_1'));
  });
});
