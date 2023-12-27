import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '../infra/typeorm/repositories/CustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class ShowCustomerService {
  public async execute({ id }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(id);

    if (!customer) {
      throw new AppError('There is no customer.');
    }

    return customer;
  }
}

export default ShowCustomerService;
