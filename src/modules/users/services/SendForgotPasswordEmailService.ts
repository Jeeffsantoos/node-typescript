import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../infra/typeorm/repositories/UsersRepository';
import path from 'path';
import AppError from '@shared/errors/AppError';
import GenerateUserTokensService from './GenerateUserTokenService';
import EtherealMail from '@config/mail/EtherealMail';
import SESMail from '@config/mail/SESMail';
import mailConfig from '@config/mail/mail';
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
    const { token } = await generateToken.execute({
      user_id: user.id,
    });

    const forgotPassowordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[API Vendas] Recuperação de senha',
        templateData: {
          file: forgotPassowordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
          },
        },
      });
    }

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de senha',
      templateData: {
        file: forgotPassowordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
