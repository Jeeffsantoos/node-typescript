import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/http/errors/AppError';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const ProductsRepository = getCustomRepository(ProductRepository);

    const product = await ProductsRepository.find();
    if (!product) {
      throw new AppError('There is no product.');
    }

    return product;
  }
}

export default ListProductService;
