import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../infra/typeorm/repositories/UsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

class ListUserService {
  public async execute(): Promise<User[]> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.find();

    if (!user) {
      throw new AppError('There is no user.');
    }

    return user;
  }
}

export default ListUserService;
