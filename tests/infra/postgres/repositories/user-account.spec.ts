import { LoadUserAccountRepository } from '@/data/interfaces/repositories';

import { newDb } from 'pg-mem';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

class PgUserAccountRepository {
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

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: number;
}

describe('PgUserAccountRepository', () => {
  describe('load()', () => {
    test('Should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();

      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({ email: 'exist_email' });

      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: 'exist_email' });

      expect(account).toEqual({ id: '1' });
    });
  });
});
