import { Request, Response } from 'express';
import CreateSessionService from '../services/CreateSessionService';
import { instanceToInstance } from 'class-transformer';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSession = new CreateSessionService();

    const user = await createSession.execute({
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
