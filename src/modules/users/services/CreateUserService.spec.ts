import 'reflect-metadata';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../domain/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUserRepository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      email: 'jefferson@email.com',
      name: 'jefferson',
      password: '123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two user with the same email', async () => {
    await createUser.execute({
      email: 'jefferson@email.com',
      name: 'jefferson',
      password: 'asd',
    });

    expect(
      createUser.execute({
        email: 'jefferson@email.com',
        name: 'jefferson',
        password: 'asd',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
