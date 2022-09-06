import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { UserEntity } from './../user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async sendMoney(
    @TransactionManager() transactionManager: EntityManager,
    from: string,
    to: string,
    amount: number,
  ) {
    await transactionManager
      .createQueryBuilder(UserEntity, 'user')
      .update(UserEntity)
      .where({ name: from })
      .set({ money: () => `money - ${amount}` })
      .execute();

    await transactionManager
      .createQueryBuilder(UserEntity, 'user')
      .update(UserEntity)
      .where({ name: to })
      .set({ money: () => `money + ${amount}` })
      .execute();

    return true;
  }
}
