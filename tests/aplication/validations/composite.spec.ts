import { mock } from 'jest-mock-extended';

interface Validatior {
  validate(): Error | undefined;
}

class ValidationComposite {
  constructor(private readonly validators: Validatior[]) {}

  validate(): undefined {
    return undefined;
  }
}

describe('ValidationComposite', () => {
  test('Should return undefined if all validators returns undefined', () => {
    const validator1 = mock<Validatior>();
    validator1.validate.mockReturnValue(undefined);

    const validator2 = mock<Validatior>();
    validator2.validate.mockReturnValue(undefined);

    const validators: Validatior[] = [validator1, validator2];
    const sut = new ValidationComposite(validators);

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
