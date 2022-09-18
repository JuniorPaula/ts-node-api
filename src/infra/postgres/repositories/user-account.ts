import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/interfaces/repositories';
import { PgUser } from '@/infra/postgres/entities';

import { getRepository } from 'typeorm';

export class PgUserAccountRepository implements LoadUserAccountRepository {
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

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<void> {
    const pgUserRepo = getRepository(PgUser);

    if (params.id === undefined) {
      await pgUserRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId,
      });
    } else {
      await pgUserRepo.update(
        {
          id: parseInt(params.id),
        },
        {
          name: params.name,
          facebookId: params.facebookId,
        },
      );
    }
  }
}
