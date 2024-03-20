import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { instanceToInstance } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = container.resolve(UpdateUserAvatarService);
    const avatarFilename = request.file!.filename;

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      avatarFilename,
    });

    return response.json(instanceToInstance(user));
  }
}
