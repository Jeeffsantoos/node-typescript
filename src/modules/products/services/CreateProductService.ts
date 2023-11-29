import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/http/errors/AppError';
import Product from '../typeorm/entities/Product';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const ProductsRepository = getCustomRepository(ProductRepository);
    const productExists = await ProductsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = ProductsRepository.create({
      name,
      price,
      quantity,
    });

    await ProductsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
