import { getCustomRepository } from 'typeorm';
import { UserTokensRepository } from '../typeorm/repositories/UserTokensRepository';
import UserToken from '../typeorm/entities/UserToken';

interface IRequest {
  user_id: string;
}

class GenerateUserTokens {
  public async execute({ user_id }: IRequest): Promise<UserToken> {
    const userTokenRepository = getCustomRepository(UserTokensRepository);

    const userToken = userTokenRepository.create({
      user_id,
    });

    await userTokenRepository.save(userToken);

    return userToken;
  }
}

export default GenerateUserTokens;
