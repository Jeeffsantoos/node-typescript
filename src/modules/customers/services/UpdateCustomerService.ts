/* eslint-disable no-unused-vars */
import Customer from '../infra/typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';
import { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

injectable();
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('There is no custumer.');
    }

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError('There is already one user with this email');
    }

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);
    return customer;
  }
}

export default UpdateCustomerService;
