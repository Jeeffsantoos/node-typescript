import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import redisCache from '@shared/cache/RedisCache';

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

    // const redisCache = new RedisCache();

    const product = ProductsRepository.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await ProductsRepository.save(product);

    return product;
  }
}

export default CreateProductService;
