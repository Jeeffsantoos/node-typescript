import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import redisCache from '@shared/cache/RedisCache';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const ProductsRepository = getCustomRepository(ProductRepository);
    // const redisCache = new RedisCache();

    let products = await redisCache.recover<Product[]>(
      'api-vendas-PRODUCT_LIST',
    );

    if (!products) {
      products = await ProductsRepository.find();
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    if (!products) {
      throw new AppError('There is no product.');
    }

    return products;
  }
}

export default ListProductService;
