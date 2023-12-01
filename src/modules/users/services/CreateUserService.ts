import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/http/errors/AppError';
import User from '../typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ email, name, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const emailExists = await usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('There is already one user with this email');
    }

    const user = usersRepository.create({
      name,
      password,
      email,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;