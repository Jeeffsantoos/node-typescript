/* eslint-disable no-unused-vars */
import Customer from '../infra/typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';
import { IShowCustomer } from '../domain/models/IShowCustomer';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('There is no customer.');
    }

    return customer;
  }
}

export default ShowCustomerService;
