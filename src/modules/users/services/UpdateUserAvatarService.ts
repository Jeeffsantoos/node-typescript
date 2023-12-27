import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../infra/typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import DiskStorageProvider from '@shared/providers/StorageProvider/DiskStorageProvider';
import uploadConfig from '@config/upload';
import S3StorageProvider from '@shared/providers/StorageProvider/S3StorageProvider';
interface IRequest {
  userId: string;
  avatarFilename: string | undefined;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found');
    }
    if (!avatarFilename) {
      throw new AppError('Avatar not found');
    }

    if (uploadConfig.driver === 's3') {
      const storageProvider = new S3StorageProvider();
      if (user.avatar) {
        await storageProvider.deleteFile(user.avatar);
      }
      const filename = await storageProvider.saveFile(avatarFilename);
      user.avatar = filename;

      return user;
    } else {
      const storageProvider = new DiskStorageProvider();
      if (user.avatar) {
        await storageProvider.deleteFile(user.avatar);
      }
      const filename = await storageProvider.saveFile(avatarFilename);
      user.avatar = filename;
      await usersRepository.save(user);

      return user;
    }
  }
}

export default UpdateUserAvatarService;
