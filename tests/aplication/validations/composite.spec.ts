import { mock, MockProxy } from 'jest-mock-extended';

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
});
