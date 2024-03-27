import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../domain/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from './CreateSessionService';

let fakeUserRepository: FakeUserRepository;
let createSession: CreateSessionService;
let hashProvider: FakeHashProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    hashProvider = new FakeHashProvider();
    createSession = new CreateSessionService(fakeUserRepository, hashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUserRepository.create({
      email: 'jefferson@email.com',
      password: '123',
      name: 'jeff',
    });

    const response = await createSession.execute({
      email: 'jefferson@email.com',
      password: '123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate if user not exists', async () => {
    expect(
      createSession.execute({
        email: 'asd@email.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate if wrong password', async () => {
    await fakeUserRepository.create({
      email: 'jefferson@email.com',
      password: '123',
      name: 'jeff',
    });

    expect(
      createSession.execute({
        email: 'jefferson@email.com',
        password: '1as23',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
