import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '../typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import Customer from '../typeorm/entities/Customer';

interface IRequest {
  name: string;
  email: string;
}

class CreateCustomerService {
  public async execute({ email, name }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const emailExists = await customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('There is already one customer with this email');
    }

    const customer = customersRepository.create({
      name,
      email,
    });

    await customersRepository.save(customer);

    return customer;
  }
}

export default CreateCustomerService;
