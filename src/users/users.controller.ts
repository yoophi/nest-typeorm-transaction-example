import { UsersRepository } from './repositories/users.repository';
import { UserEntity } from './user.entity';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { getManager } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private usersRepository: UsersRepository) {}

  @Post()
  async createUser(@Body() { name }: { name: string }) {
    const user = await this.usersRepository.save({ name: name });
    console.log({ user });
    return user;
  }

  @Get(':name')
  async getUser(@Param() { name }: { name: string }) {
    const user = await this.usersRepository.findOne({ name });
    return user;
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  @Post('/tr')
  async sendMoneyToUser(
    @Body()
    { from, to, amount }: { from: string; to: string; amount: number },
  ) {
    try {
      await getManager().transaction(async (manager) => {
        await manager
          .createQueryBuilder(UserEntity, 'user')
          .update(UserEntity)
          .where({ name: from })
          .set({ money: () => `money - ${amount}` })
          .execute();

        await manager
          .createQueryBuilder(UserEntity, 'user')
          .update(UserEntity)
          .where({ name: to })
          .set({ money: () => `money + ${amount}` })
          .execute();

        console.log(await manager.find(UserEntity));

        const fromUser = await manager.findOne(UserEntity, { name: from });

        console.log({ fromUser });

        if (fromUser.money < 0) {
          throw new Error('not enough money!');
        }
      });

      return { message: 'transaction success' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/tx')
  async sendMoneyToUserWithRepository(
    @Body()
    { from, to, amount }: { from: string; to: string; amount: number },
  ) {
    try {
      await getManager().transaction(async (manager) => {
        await this.usersRepository.sendMoney(manager, from, to, amount);

        console.log(await manager.find(UserEntity));

        const fromUser = await manager.findOne(UserEntity, { name: from });

        console.log({ fromUser });

        if (fromUser.money < 0) {
          throw new Error('not enough money!');
        }
      });

      return { message: 'transaction success' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
