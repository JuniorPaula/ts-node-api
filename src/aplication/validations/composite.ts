import { Validatior } from '@/aplication/validations';

export class ValidationComposite implements Validatior {
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
