import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '../infra/typeorm/repositories/CustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer;
}

class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customers = await customersRepository.createQueryBuilder().paginate();

    if (!customers) {
      throw new AppError('There is no customers.');
    }

    return customers as IPaginateCustomer;
  }
}

export default ListCustomerService;
