import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/data/interfaces/repositories';
import { PgUser } from '@/infra/postgres/entities';

import { getRepository } from 'typeorm';

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  private readonly pgUserRepo = getRepository(PgUser);
  async load(
    params: LoadUserAccountRepository.Params,
  ): Promise<LoadUserAccountRepository.Result> {
    const user = await this.pgUserRepo.findOne({ email: params.email });

    if (user !== undefined) {
      return {
        id: user.id.toString(),
        name: user.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(
    params: SaveFacebookAccountRepository.Params,
  ): Promise<SaveFacebookAccountRepository.Result> {
    let id: string;

    if (params.id === undefined) {
      const user = await this.pgUserRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId,
      });
      id = user.id.toString();
    } else {
      id = params.id;
      await this.pgUserRepo.update(
        {
          id: parseInt(params.id),
        },
        {
          name: params.name,
          facebookId: params.facebookId,
        },
      );
    }
    return { id };
  }
}
