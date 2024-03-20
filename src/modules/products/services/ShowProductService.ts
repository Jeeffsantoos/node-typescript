/* eslint-disable no-unused-vars */
import Product from '../infra/typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import { IShowCustomer } from '@modules/customers/domain/models/IShowCustomer';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductRepository';

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IShowCustomer): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found.');
    }

    return product;
  }
}

export default ShowProductService;
