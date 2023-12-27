import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { UserTokensRepository } from '../infra/typeorm/repositories/UserTokensRepository';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const usersTokenRepository = getCustomRepository(UserTokensRepository);

    const userToken = await usersTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }

    const user = await usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    const hashedPassword = await hash(password, 8);

    user.password = hashedPassword;

    await usersRepository.save(user);
  }
}

export default ResetPasswordService;
