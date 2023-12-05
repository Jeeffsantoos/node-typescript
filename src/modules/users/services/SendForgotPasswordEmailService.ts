import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import GenerateUserTokensService from './GenerateUserTokenService';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const generateToken = new GenerateUserTokensService();

    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }
    const token = await generateToken.execute({
      user_id: user.id,
    });

    console.log(token);
  }
}

export default SendForgotPasswordEmailService;
