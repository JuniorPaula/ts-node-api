import { getRepository } from 'typeorm';
import { LoadUserAccountRepository } from '@/data/interfaces/repositories';
import { PgUser } from '@/infra/postgres/entities';

export class PgUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const user = await pgUserRepo.findOne({ email: params.email });

    if (user !== undefined) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined,
      };
    }
  }
}
