/* eslint-disable no-unused-vars */
import AppError from '@shared/errors/AppError';
import { IDeleteCustomer } from '../domain/models/IDeleteCustomer';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('There is no customer.');
    }

    await this.customersRepository.remove(customer);
  }
}

export default DeleteCustomerService;
