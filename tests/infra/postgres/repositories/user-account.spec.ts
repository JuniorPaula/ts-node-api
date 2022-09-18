import { LoadUserAccountRepository } from '@/data/interfaces/repositories';

import { IBackup, newDb } from 'pg-mem';
import {
  Column,
  Entity,
  getConnection,
  getRepository,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

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
    let sut: PgUserAccountRepository;
    let pgUserRepo: Repository<PgUser>;
    let backup: IBackup;

    beforeAll(async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });
      await connection.synchronize();
      backup = db.backup();
      pgUserRepo = getRepository(PgUser);
    });

    afterAll(async () => {
      await getConnection().close();
    });

    beforeEach(() => {
      backup.restore();
      sut = new PgUserAccountRepository();
    });

    test('Should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'any_email' });
      const account = await sut.load({ email: 'any_email' });

      expect(account).toEqual({ id: '1' });
    });

    test('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'any_email' });

      expect(account).toBeUndefined();
    });
  });
});